
<?php

    $inData = getRequestInfo();

    $id = 0;
    $firstName = "";
    $lastName = "";
    $login = "";
    $password = "";

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("SELECT ID, Name, Phone, Email, UserId FROM Contacts WHERE Name=? AND Phone=? AND Email=? AND UserId=?");
		$stmt->bind_param("ssss", $inData["name"], $inData["phone"], $inData["email"], $inData["userId"]);
		$stmt->execute();

        $result = $stmt->get_result();

        if( $row = $result->fetch_assoc()  )
        {
            returnWithError("Contact Already Exists.");
        }
        else
        {
            $stmt = $conn->prepare("INSERT INTO Contacts(Name, Phone, Email, UserId) VALUES(?,?,?,?)");
            $stmt->bind_param("ssss", $inData["name"], $inData["phone"], $inData["email"], $inData["userId"]);
            $stmt->execute();

            $stmt = $conn->prepare("SELECT ID, Name, Phone, Email, UserId FROM Contacts WHERE Name=? AND Phone=? AND Email=? AND UserId=?");
            $stmt->bind_param("ssss", $inData["name"], $inData["phone"], $inData["email"], $inData["userId"]);
            $stmt->execute();

            $result = $stmt->get_result();

            $row = $result->fetch_assoc();
            
            returnWithInfo($row['ID'], $row['Name'], $row['Phone'], $row['Email'], $row['UserId']);
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
