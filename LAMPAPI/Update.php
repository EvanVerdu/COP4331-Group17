
<?php

    $inData = getRequestInfo();

    $id = 0;

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("SELECT ID, Name, Phone, Email, UserId FROM Contacts WHERE ID=?");
		$stmt->bind_param("s", $inData["id"]);
		$stmt->execute();

        $result = $stmt->get_result();

        if( $row = $result->fetch_assoc()  )
        {
            $stmt = $conn->prepare("UPDATE Contacts SET Name=?, Phone=?, Email=? WHERE ID=?");
            $stmt->bind_param("ssss", $inData["name"], $inData["phone"], $inData["email"], $inData["id"]);
            $stmt->execute();

            $stmt = $conn->prepare("SELECT ID, Name, Phone, Email, UserId FROM Contacts WHERE ID=?");
            $stmt->bind_param("s", $inData["id"]);
            $stmt->execute();

            $result = $stmt->get_result();

            $row = $result->fetch_assoc();
            
            returnWithInfo( $row['ID'],  $row['Name'],  $row['Phone'],  $row['Email'],  $row['UserId'],);
            
        }
        else
        {
            returnWithError("Contact Doesn't Exists.");
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError( $err )
    {
        $retValue = '{"id":0,"name":"","phone":"","email":"","userId":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithInfo($id, $name, $phone, $email, $userId)
    {
        $retValue = '{"id":' . $id . ',"name":"' . $name . '","phone":"' . $phone . '","email":"' . $email . '","userId":"' . $userId . '","error":""}';
        sendResultInfoAsJson( $retValue );
    }

?>
