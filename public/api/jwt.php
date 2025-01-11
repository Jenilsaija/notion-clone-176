<?php
    class JWT {
        function __construct() {
            $this->securekey="SecrateDEMSKEYbyTls176";
        }
        public function getJwtwithData($string){
            $header = json_encode([
                "alg" => "HS256",
                "typ" => "JWT"
            ]);

            $header = $this->base64urlEncode($header);
            
            $payload = json_encode($string);
            
            $payload = $this->base64urlEncode($payload);
    
            $signature = hash_hmac("sha256", $header . "." . $payload,$this->securekey, true);
            $signature = $this->base64urlEncode($signature);
            $token = $header . "." . $payload . "." . $signature;

            return $token;
        }

        public function validateToken($token){
            $tokenParts = explode(".", $token);
            $header = $tokenParts[0];
            $payload = $tokenParts[1];
            $signatureProvided = $tokenParts[2];
            $data = json_decode($this->base64urlDecode($payload));
            $signature = $this->base64urlEncode(hash_hmac("sha256", $header . "." . $payload, $this->securekey, true));
            if ($signatureProvided == $signature) {
                return $data;
            } else {
                return null;
            }
        }


        private function base64URLEncode($text)
        {
            return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($text));
        }

        private function base64URLDecode($text)
        {
            return base64_decode(
                str_replace(
                    ["-", "_"],
                    ["+", "/"],
                    $text
                )
            );
        }
    }
?>