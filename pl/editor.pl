#!/usr/bin/perl

use strict;
use warnings;
use CGI;
use DBI;
use JSON::Parse ':all';

require 'FNS.pl';

# Read param values from client
my $cgi = CGI->new();

print $cgi->header(-type => "application/json", -charset => "utf-8");

if ($cgi->param("get") ne "") {	
	getObjects ($cgi->param("get"));
} else {
	if ($cgi->param("update") ne "") {
		updateDB ($cgi->param("update"));
	}
	if ($cgi->param("add_prepare") ne "") {
		add_prepare ($cgi->param("add_prepare"));
	}
	if ($cgi->param("add") ne "") {
		add ($cgi->param("add"));
	}
	if ($cgi->param("del") ne "") {
		del ($cgi->param("del"));
	}
	if ($cgi->param("change") ne "") {
		change ($cgi->param("change"));
	}
}

sub add {
	my $json = $_[0];
        my $jp = parse_json($json);
	my $cc = parse_json(FNS::getCC());
	my $sql;
	my $f = '';
	my $v = '';

	while( my( $table, $entrys ) = each $jp ) {
		while( my( $code, $data ) = each $entrys ) {
			$f = 'code, '; $v = '"' . $code . '",';
			while( my( $field, $value ) = each $data ){
				$f .= $field . ',';
				$v .= '"' . $value . '"' . ',';
			}
			while ( my($id, $ccdata) = each $cc ) {
				while( my( $i, $d ) = each $ccdata ) {
					while( my( $x, $ccode ) = each $d ) {
						$sql = 'INSERT INTO `object_price' . '` (code, country_code) VALUES (' 
										   . $code . ', "' . $ccode . '")';
						sql ($sql);
					}
				}
			}
		}
		$f =~ s/,$//;
		$v =~ s/,$//;
		$sql = 'INSERT INTO `object_' . $table . '` (' . $f . ') VALUES (' . $v . ')';
		sql ($sql);
	}

	print '{}';
}

sub change {
        my $json = $_[0];
        my $jp = parse_json($json);
        my $sql;
        my $f = '';
        my $v = '';
	my $c;

        while( my( $table, $entrys ) = each $jp ) {
                while( my( $code, $data ) = each $entrys ) {
			$c = $code;
                        while( my( $field, $value ) = each $data ){
				$v = '"' . $value . '"';
                                $f .= $field . '=' . $v . ',';
                        }
		}
                $f =~ s/,$//;
                $sql = 'UPDATE `object_' . $table . '` SET ' . $f . 'WHERE code="' . $c . '"';
                sql($sql);
        }

        print '{}';
}

sub del {
        my $json = $_[0];
        my $jp = parse_json($json);
        my $sql;
        my $f = '';
        my $v = '';

        while( my( $table, $entrys ) = each $jp ) {
                while( my( $code, $data ) = each $entrys ) {
                        $sql = 'DELETE FROM `object_price` WHERE code="' . $code . '"';
                        sql ($sql);
                        $sql = 'DELETE FROM `object_' . $table . '` WHERE code="' . $code . '"';
                        sql ($sql);
                }
        }

        print '{}';
}

sub add_prepare {
	my $json = $_[0];
	my $jp = parse_json($json);
	my $id;
	my $sql;
	my $result;	
	my $str;
	my $complete_str = '';

	while( my( $table, $entrys ) = each $jp ){
		while( my( $title, $field ) = each $entrys ){
			$sql = qq(select column_type from information_schema.columns where table_name = "object_) . $table . qq(" and )
                                        . qq(column_name = ") . $field . qq(");
			$str = FNS::getDataFromDB($sql);
			if (index($str, 'enum') != -1) {
				$str =~ s/\'//g; $str =~ s/enum//g; $str =~ s/\(//g; $str =~ s/\)//g;
				$complete_str .= '"' . $field . '":' . qq(") . $str . qq(") . ',';
			} else {
				$complete_str .= '"' . $field . '":' . qq("") . ',';
			} # endif
		}
	$complete_str =~ s/,$//;
        $complete_str = '{"' . $table . '":{' . $complete_str . '}}';
	}
		
	print $complete_str;
}

sub updateDB {
	my $json = $_[0];
	my $jp = parse_json($json);
	my $id;
	my $sql;
	
	while( my( $table, $entrys ) = each $jp ){
	    while( my( $code, $data ) = each $entrys ){
		while( my( $field, $value ) = each $data ){
			if ($table ne 'price') {
				if ($field ne 'id' && $field ne 'code' && $field ne 'timestamp') {
					$sql = 'UPDATE object_' . $table . ' SET ' . $field . '="' . $value . '" WHERE code="' . $code . '"';
					sql($sql);
				}
			} else {
				$sql = 'UPDATE object_' . $table . ' SET price="' . $value . '" WHERE code="' . $code . '" and country_code="'.$field .'"';
				sql($sql);
			}
		}
	    }
	}

	print '{}';
}

sub getObjects {
	my $json = $_[0];
	my $jp = parse_json($json);
	my $table;
	my $id;
	my $sql;
	my $result = '';
	
	$result = '{';
	while( my( $t, @elarr ) = each $jp ){
	    $table = $t;
	    $sql = 'SELECT * from object_' . $table;
	    $result .= sql($sql,$table) . ",";
	}
	$result = substr($result,0,-1);
	$result .= '}';
	print $result;
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
	$result = '"' . $_[1] . '":['.$table.']';

        $dbh->disconnect or warn "Disconnection failed: $DBI::errstr\n";

	return $result;
}
