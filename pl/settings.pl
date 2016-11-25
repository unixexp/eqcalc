#!/usr/bin/perl

use strict;
use warnings;
use CGI;
use DBI;
use JSON::Parse ':all';

# Read param values from client
my $cgi = CGI->new();

print $cgi->header(-type => "application/json", -charset => "utf-8");

setData ($cgi);

sub setData {
	my $json = $_[0]->param("s");
	my $jp = parse_json($json);
	my $table;
	my $id;
	my $sql;

	while( my( $t, @elarr ) = each $jp ){
	    $table = $t;
	    while( my( $index, $element ) = each $elarr[0] ){
		while( my( $field, $value ) = each $element ){
			if ($field eq 'id') { 
				$id = $value;
			}
		}
		while ( my( $field, $value) = each $element ) {
			if ($field ne 'id') {
				$sql = 'UPDATE ' . $table . ' SET ' . $field . '=' . $value . ' WHERE id=' . $id;
				sql($sql);
			}
		}
	    }
	}
	print '{}';
}

# For Debug
sub logging {
	my $filename = 'srv.log';
	open(my $fh, '>', $filename);
	print $fh $_[0];
	close $fh;
}

sub sql {
	my $tableRow;
	my $table = "";
	my $result;
	my $ref;
        my $dbh = DBI->connect("DBI:mysql:database=eqcalc_db;host=localhost;port=3306",
                                        "eqcalc", "eqcalc") or die $DBI::errstr;
        my $sth = $dbh->prepare($_[0]);
        $sth->execute();

	while ($ref = $sth->fetchrow_hashref()) {
		while ((my $key, my $value) = each(%$ref)){
			  $key =~ s/"/\\"/g;
		  	  $value =~ s/"/\\"/g;
			  $tableRow .= "\"${key}\":\"${value}\",";
		  }

		  $tableRow =~ s/,$//;
		  $tableRow = "{${tableRow}},";
 
		  $table .= $tableRow;
		  $tableRow = "";
	}

	$table =~ s/,$//;
	$result = '{"failure":0,"result":['.$table.']}';

        $dbh->disconnect or warn "Disconnection failed: $DBI::errstr\n";

	return $result;
}
