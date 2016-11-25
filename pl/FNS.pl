package FNS;

sub getCC {
        my ($str, $json_response);

        my $sql = qq(select column_type from information_schema.columns where table_name = "object_price" and )
                                        . qq(column_name = "country_code");
        $str = getDataFromDB($sql);
        $str =~ s/\'//g; $str =~ s/enum//g; $str =~ s/\(//g; $str =~ s/\)//g;
        my @country_codes_array = split /,/, $str;
        my $country_codes_JSON = "";

        for (my $x=0;$x<scalar @country_codes_array;$x++) {
                if ($x<(scalar @country_codes_array-1)) {
                        $country_codes_JSON = $country_codes_JSON . qq({"country_code":") . $country_codes_array[$x] . qq("},);
                } else {
                        $country_codes_JSON = $country_codes_JSON . qq({"country_code":") . $country_codes_array[$x] . qq("});
                }
        }
        return $json_response = qq({"country_codes":[) . $country_codes_JSON. "]}";
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

1;
