
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
            $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=?");
            $stmt->bind_param("s", $inData["id"]);
            $stmt->execute();
            
            returnWithSuccess();
            
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
        $retValue = '{"id":0,"status":"fail","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithSuccess()
    {
        $retValue = '{"id":0,"status":"success","error":""}';
        sendResultInfoAsJson( $retValue );
    }

?>
