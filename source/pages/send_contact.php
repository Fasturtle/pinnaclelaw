<?php
require_once(dirname(__FILE__).'/class.phpmailer.php');

// set header
header('Content-Type: application/json');

if(isset($_POST)){
    // create message
    $message = '';
    foreach($_POST as $key => $value){
        $message .= $key.': '. $value.'\n';
    }

    // create email
    $email = new PHPMailer();
    $email->From = 'noreply@azpinnaclelaw.com';
    $email->FromName = 'Pinnacle Website';
    $email->Subject = 'Pinnacle Contact Form';
    $email->Body = str_replace(array('\r', '\n'), array(chr(10), chr(13)), $message);
    $email->AddAddress('john.rhude@azpinnaclelaw.com');
    //$email->AddAddress('dutley@mosesinc.com');
    $email->ContentType = 'text/plain';
    $email->IsHTML(false);

    // send email
    if($email->Send()){
        echo json_encode(['success'=>true]);
    }else{
        echo json_encode(['success'=>false,'error'=>'error sending email']);
    }
}else{
    echo json_encode(['success'=>false,'error'=>'empty post']);
}
?>