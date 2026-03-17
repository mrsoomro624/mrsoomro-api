<?php
header('Content-Type: application/json');

/* MRSOOMRO PREMIUM DATABASE API 
   Owner: Hadaiat Ullah
   WhatsApp: +447455680379
*/

$number = isset($_GET['number']) ? $_GET['number'] : '';

if(empty($number)) {
    echo json_encode(["status" => "error", "message" => "Please enter number"]);
    exit;
}

// Mobile number format fix (03xx...)
$number = ltrim($number, '0');
$number = "0" . $number;

// Teeno sources ko check karne ka function
function fetch_data($url, $number) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    
    // In sites ke liye common post fields
    $post_fields = "number=" . urlencode($number) . "&search=submit&btnsearch=Search";
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 20);

    // Ye headers Cloudflare ko dhoka dene ke liye hain
    $headers = [
        "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Content-Type: application/x-www-form-urlencoded",
        "User-Agent: Mozilla/5.0 (Linux; Android 10; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
        "Origin: " . parse_url($url, PHP_URL_SCHEME) . "://" . parse_url($url, PHP_URL_HOST),
        "Referer: " . $url
    ];
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $res = curl_exec($ch);
    curl_close($ch);
    return $res;
}

$sources = [
    "https://javeriasimdatabase.com/search.php",
    "https://3dsimdatabase.com/search.php",
    "https://freshsimsdatabases.com/search.php"
];

$found = false;
$result_text = "";

foreach ($sources as $site) {
    $html = fetch_data($site, $number);
    
    // Check if result contains typical data markers
    if (stripos($html, 'NAME') !== false || stripos($html, 'CNIC') !== false || stripos($html, 'ADDRESS') !== false) {
        // Strip tags but keep it readable
        $result_text = strip_tags($html);
        $found = true;
        break; 
    }
}

if ($found) {
    // Faltu ki spaces aur lines saaf karna
    $clean_data = preg_replace('/\s+/', ' ', trim($result_text));
    
    echo json_encode([
        "status" => "success",
        "api_name" => "MRSOOMRO TOOLS",
        "developer" => "Hadaiat Ullah",
        "whatsapp" => "+447455680379",
        "data" => $clean_data
    ], JSON_PRETTY_PRINT);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Database response empty. Target sites might be blocking your hosting IP.",
        "tip" => "Use a Paid Hosting or Premium Proxy",
        "developer" => "MRSOOMRO"
    ], JSON_PRETTY_PRINT);
}
?>
