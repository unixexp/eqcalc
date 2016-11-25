#!/usr/bin/perl

package Calculator;
use strict;
use warnings;
use CGI;
use DBI;

require 'FNS.pl';

# Read param values from client
my $cgi = CGI->new();

print $cgi->header(-type => "application/json", -charset => "utf-8");

# What does client part want?
if ($cgi->param("function") eq "getCC") {
	print FNS::getCC();
}
if ($cgi->param("function") eq "getObjectData") {
        print sendObjectDataToClient($cgi);
}
if ($cgi->param("function") eq "getMathVars") {
        print getMathVars($cgi);
}

# For Debug
sub logging {
	my $filename = 'srv.log';
	open(my $fh, '>', $filename);
	print $fh $_[0];
	close $fh;
}

# ---------------------------------
# Get data from DB implementation

sub parseObjectFieldsToSql {
	my @fields = split /\|/, $_[0];
	my $fields_sql = qq("fields":[);
	my $delimiter = ",";	
	my $s;

	for (my $x=0;$x<scalar @fields;$x++) {
		if ($x==(scalar @fields-1)) { $delimiter = ""; }
		$s = $fields[$x];
		$s =~ s/\!//g;
		$fields_sql = $fields_sql . qq({") . $fields[$x] . qq(":"', ) . "object_" . $_[1] . "." . $s . qq(, '"}) . $delimiter;
	}	

	$fields_sql = $fields_sql . qq(]);
	return $fields_sql;
}

sub sendObjectDataToClient {
	my @str;
	my $json_response = qq({"getObjectData":[);
	my $sql;
	my $json_string_helper;
	my $fields_sql;

	my $obj_start = 0; 
	my $obj_count = scalar $_[0]->param("objects");	

	# Checking selection value of master object
	if ($_[0]->param("objects") == scalar 1) {
		$obj_count = 1;
        } else { $obj_start=1; }

	for (my $obj=$obj_start;$obj<$obj_count;$obj++) {
		if ($obj==$obj_count-1) { $json_string_helper = ''; 
                } else { $json_string_helper = ','; }
                
		# Generate request for SELECTOR type object
		if ($_[0]->param("obj_". $obj ."_type") eq 'SELECTOR' || $_[0]->param("obj_". $obj ."_type") eq 'SELECTOR_Q') {

			@str = split(/_/, $_[0]->param("obj_". $obj ."_id"));
			$fields_sql = parseObjectFieldsToSql($_[0]->param("obj_".$obj."_fields"), $str[0]);
			if ($_[0]->param("obj_". $obj ."_vtype") eq 'static') {	
				 if ($_[0]->param("obj_". $obj ."_type") eq 'SELECTOR_Q') {			
					$sql = qq(select concat\('{) . $fields_sql . qq(, ', ). qq('"code":"', object_)
					. $_[0]->param("obj_". $obj ."_id") . qq(.code, '", ', '"q":"', object_)
					. $_[0]->param("obj_0_id") . "." . $_[0]->param("obj_". $obj ."_id") . qq(_q, '"}'\))
					. qq( as row from object_) . $_[0]->param("obj_". $obj ."_id") . ",object_" . $_[0]->param("obj_0_id");
					logging ($sql);
				} else {
					$sql = qq(select concat\('{) . $fields_sql . qq(, ', '"code":"', code, '"}'\))
					. qq( as row from object_) . $_[0]->param("obj_". $obj ."_id");
				} #end else
				if ($_[0]->param("obj_". $obj ."_condition-field") eq '') {
					$sql = $sql . ';';
				} else {
					if ($_[0]->param("obj_". $obj ."_type") eq 'SELECTOR_Q') {
						$sql = $sql . ' where object_' . $_[0]->param("obj_". $obj ."_id") 
						. "." . $_[0]->param("obj_". $obj ."_condition-field")
						. ' in (select ' . $_[0]->param("obj_". $obj ."_condition-field") . ' from object_'
						. $_[0]->param("obj_0_id") . ' where code=\'' . $_[0]->param("obj_0_value") . '\') and object_' 
						. $_[0]->param("obj_0_id") . '.' . 'code=\'' . $_[0]->param("obj_0_value") . '\';';
					} else {
						$sql = $sql . ' where ' . $_[0]->param("obj_". $obj ."_condition-field")
						. ' in (select ' . $_[0]->param("obj_". $obj ."_condition-field") . ' from object_'
						. $_[0]->param("obj_0_id") . ' where code=\'' . $_[0]->param("obj_0_value") . '\');';
					} #end if
				}
			} else {
				if ($_[0]->param("obj_". $obj ."_vtype") eq 'dynamic') {
					$sql = qq(select concat\('{) . $fields_sql
                                        	. qq(, ', '"code":"', object_) . $str[0]
                                        	. qq(.code, '",', '"qty":"', object_) . $_[0]->param("obj_0_id") . qq(.)
                                        	. $str[0] . qq(_qty) . qq(, '"}'\))
                                        	. qq( as row from object_) . $str[0] . qq(,object_)
                                        	. $_[0]->param("obj_0_id") . qq( where object_) . $_[0]->param("obj_0_id") . qq(.code=')
                                        	. $_[0]->param("obj_0_value") . qq(');
					logging ($sql);
					if ($_[0]->param("obj_". $obj ."_condition-field") eq '') {
                                		$sql = $sql . ';';
                        		} else {
                                		$sql = $sql . ' where ' . $_[0]->param("obj_". $obj ."_condition-field")
                                		. ' in (select ' . $_[0]->param("obj_". $obj ."_condition-field") . ' from object_'
                                		. $_[0]->param("obj_0_id") . ' where code=\'' . $_[0]->param("obj_0_value") . '\');';
						logging ($sql);
                        		}
				}
			}
		}

		# Generate request for PRICE type object
		if ($_[0]->param("obj_". $obj ."_type") eq 'PRICE') {
			$sql = qq(select price from object_price where code=') . $_[0]->param("obj_0_value") . qq(' and country_code=')
			. $_[0]->param("obj_". $obj ."_condition-field") . qq(');
			
		}
		$json_response = $json_response . qq({"id":") . $_[0]->param("obj_". $obj ."_id") . qq(")
                                                . qq(,"type":") . $_[0]->param("obj_". $obj ."_type") . qq(")
						. qq(,"vtype":") . $_[0]->param("obj_". $obj ."_vtype") . qq(")
						. qq(,"master":") . $_[0]->param("obj_". $obj ."_master") . qq(")
                                                . qq(,"values":[) . getDataFromDB($sql) . qq(]}) . $json_string_helper;

	}
	$json_response = $json_response . qq(]});
	return $json_response;
}

sub getMathVars {
	my $sql;
	my $str;
	my $json_response = '';	

	$sql = qq(select concat('{"id":"', id, '",', '"price":"', price, '",', '"CC":"', country_code, '"}') as row from primeprice);
	$str = qq({"primeprice":[) . getDataFromDB($sql) . qq(],);

	$sql = qq(select concat('{"id":"', id, '",', '"months":"', months,  '"}') as row from payback);
	$str = $str . qq("payback":[) . getDataFromDB($sql) . qq(]});

	$json_response = $json_response . $str;
        return $json_response;
}

sub getDataFromDB {
	my $dbh = DBI->connect("DBI:mysql:database=eqcalc_db;host=localhost;port=3306",
                                        "eqcalc", "eqcalc") or die $DBI::errstr;
	my $sth = $dbh->prepare($_[0]);	

        my $rv = $sth->execute;
        my $rows = $sth->rows;
        my $json_rows = '';
        my $i = 0;

	while (my ($r) = $sth->fetchrow_array()) {
                                        $i = $i + 1;
                                        if ($i < ($rows) ) {
                                                                $json_rows = $json_rows . $r . ",";
                                        } else {
                                                $json_rows = $json_rows . $r;
                                        }
        }

	$dbh->disconnect or warn "Disconnection failed: $DBI::errstr\n";

        return $json_rows;
}

