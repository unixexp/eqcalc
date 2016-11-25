#!/usr/bin/perl

use strict;
use warnings;
use CGI;
use DBI;
use JSON::Parse ':all';

# Read param values from client
my $cgi = CGI->new();

print $cgi->header(-type => "application/json", -charset => "utf-8");

if ($cgi->param("s")) {
	save ($cgi);
}

if ($cgi->param("l") ne '') {
	load (); 
}

if ($cgi->param("d")) {
	del ($cgi);
}

sub del {
	my $sql = 'DELETE from `saved_reports` WHERE id=' . $_[0]->param("d");
	sql($sql);
	print '{}';
}

sub load {
	my $sql = 'SELECT * FROM `saved_reports`';
	print (sql($sql));
}

sub save {
	my $json = $_[0]->param("s");
	my $jp = parse_json($json);
	my $k = '';
	my $v = '';

	while( my( $key, $value ) = each $jp ){
	    $k = $k . '' . $key . ', ';
	    $v = $v . '\'' . $value . '\', ';
	}

	$k = substr($k, 0, -2); $v = substr($v, 0, -2); $v =~ s/_!PLUS!_/\+/g;

	my $sql = 'INSERT INTO `saved_reports` (' . qq($k) . ') VALUES (' . qq($v) . ')';
	my $json_res = sql ($sql);

	$sql = 'SELECT * FROM `saved_reports`';
	print (sql($sql));
	logging ($sql);
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
