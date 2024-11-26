import { Box, Button, Text, VStack, useToast } from "@chakra-ui/react";
import { Html5Qrcode } from "html5-qrcode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const QRScanner: React.FC = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const toast = useToast();

  useEffect(() => {
    let html5QrCode: Html5Qrcode;

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode("reader");

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // Handle successful scan
            try {
              const category = decodedText.toLowerCase();
              navigate(`/category/${category}`);
              stopScanner();
            } catch (error) {
              console.error("Error processing QR code:", error);
              toast({
                title: "Invalid QR Code",
                description: "This QR code is not in the correct format.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            }
          },
          (error) => {
            // Ignore errors during scanning
          }
        );

        setIsScanning(true);
      } catch (err) {
        console.error("Error starting scanner:", err);
        toast({
          title: "Camera Error",
          description: "Unable to access camera. Please check permissions.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    const stopScanner = async () => {
      if (html5QrCode?.isScanning) {
        await html5QrCode.stop();
        setIsScanning(false);
      }
    };

    if (isScanning) {
      startScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isScanning, navigate, toast]);

  return (
    <VStack spacing={4} align="center" w="100%" maxW="500px" mx="auto" p={4}>
      <Text fontSize="xl" fontWeight="bold">
        QR Code Scanner
      </Text>

      <Box
        id="reader"
        w="100%"
        h="300px"
        border="2px solid"
        borderColor="gray.200"
        borderRadius="md"
        overflow="hidden"
        display={isScanning ? "block" : "none"}
      />

      <Button colorScheme="blue" onClick={() => setIsScanning(!isScanning)}>
        {isScanning ? "Stop Scanner" : "Start Scanner"}
      </Button>

      <Text fontSize="sm" color="gray.600" textAlign="center">
        Point your camera at a product QR code to scan
      </Text>
    </VStack>
  );
};

export default QRScanner;
