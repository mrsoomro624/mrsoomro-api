<?php
// OFFICIAL MRSOOMRO PRIVATE API
header('Content-Type: json');
header('Access-Control-Allow-Origin: *');

$number = $_GET['number'] ?? '';
if (empty($number)) {
    echo json_encode(["status" => "error", "name" => "MRSOOMRO", "message" => "Number dalo!"]);
    exit;
}

$num = ltrim($number, '0');

// --- SECRET TARGETS ---
$targets = [
    "https://freshsimsdatabases.com/fetch.php?num=" . $num,
    "https://3dsimdatabase.com/api.php?number=" . $num,
    "https://freelivetraker.com/search.php"
];

$final_data = null;
$found = false;

foreach ($targets as $url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    
    // POST Request agar search.php ho
    if (strpos($url, 'search.php') !== false) {
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, "number=$num");
    }

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
    
    $raw_response = curl_exec($ch);
    curl_close($ch);

    if ($raw_response && !strpos($raw_response, "No Record") && strlen($raw_response) > 30) {
        // --- 100% BRANDING FILTER ---
        // Sab dusre names ki list yahan hai
        $other_names = [
            "FreshSims", "3DSim", "JBK", "Darkwork", "Night-Howler", 
            "LiveTracker", "Database", "Shehzad", "Hadaiat Ullah"
        ];
        
        // Un sab ko mita kar sirf MRSOOMRO likho
        $clean_step1 = str_ireplace($other_names, "MRSOOMRO", $raw_response);
        $final_data = strip_tags($clean_step1);
        
        $found = true;
        break; 
    }
}

// FINAL OUTPUT: SIRF MRSOOMRO
if ($found) {
    echo json_encode([
        "status" => "success",
        "name" => "MRSOOMRO",
        "whatsapp" => "923072570480",
        "result" => trim($final_data)
    ], JSON_PRETTY_PRINT);
} else {
    echo json_encode([
        "status" => "failed",
        "name" => "MRSOOMRO",
        "message" => "No record found in MRSOOMRO server."
    ], JSON_PRETTY_PRINT);
}
?>
