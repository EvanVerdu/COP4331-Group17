    {
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE Name LIKE ? AND UserID=?");
        $search = "%" . $inData["search"] . "%";
	$stmt->bind_param("ss", $search, $inData["userID"]);
	$stmt->execute();

	$result = $stmt->get_result();

  	while($row = $result->fetch_assoc())
  	{
    		if( $searchCount > 0 )
    		{
    		    $searchResults .= ",";
    		}

    		$searchCount++;
    		$searchResults .= '{"Name" : "' . $row["Name"] . '", "Phone" : "' . $row["Phone"] . '", "Email" : "' . $row["Email"] . '"}';
	}

    	if( $searchCount == 0 )
    	{
    		returnWithError( "No Records Found" );
    	}
    	else
   	{
    		returnWithInfo( $searchResults );
    	}

    	$stmt->close();
    	$conn->close();
    	}


	@@ -67,4 +67,4 @@ function returnWithInfo( $searchResults )
        sendResultInfoAsJson( $retValue );
    }

?>
