"use client";
import CardWrapper from "@/components/CardWrapper";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/lib/services/email.services";
import {
  checkIfTokenExpired,
  checkIfUserVerified,
  deleteVerificationToken,
  getVerificationTokenByToken,
} from "@/lib/services/verification.services";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BeatLoader, ScaleLoader } from "react-spinners";

const VerifyPage = () => {
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [tokenExpired, setTokenExpired] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [verifying, setVerifying] = useState(false); // Add verifying state

  const searchParams = useSearchParams();
  const router = useRouter();

  const urlToken = searchParams.get("token");

  const handleVerification = async (token: string) => {
    setVerifying(true);
    try {
      const verifyToken = await getVerificationTokenByToken(token);
      const email = verifyToken?.email;
      if (email) {
        const verifiedUser = await verifyEmail(email);
        if (verifiedUser) {
          setVerified(true);
          await deleteVerificationToken(token);
        } else {
          setError("Failed to verify email");
        }
      } else {
        setError("Invalid verification token");
      }
    } catch (err) {
      setError("An error occurred during verification");
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    const handleCases = async () => {
      if (!urlToken) {
        setError("No verification token provided");
        setLoading(false);
        return;
      }

      try {
        // Check token expiration first
        const tokenExpired = await checkIfTokenExpired(urlToken);
        if (tokenExpired) {
          setTokenExpired(true);
          setError("Token expired");
          setLoading(false);
          return;
        }

        // Then check if user is already verified
        const userVerified = await checkIfUserVerified(urlToken);
        if (userVerified) {
          setVerified(true);
        }
      } catch (err) {
        setError("Failed to validate token");
      } finally {
        setLoading(false);
      }
    };

    handleCases();
  }, [urlToken]);

  const handleButtonClick = async () => {
    if (verified) {
      router.push("/auth/login?verified=true");
    } else if (!tokenExpired && urlToken) {
      await handleVerification(urlToken);
    }
  };

  // Show loading state while checking token
  if (loading) {
    return (
      <CardWrapper
        headerLabel="Verify Your Email"
        backButtonLabel="Landed here by mistake?"
        backButtonHref="/"
      >
        <div className="flex justify-center flex-col items-center space-y-4">
          <BeatLoader />
          <span>Checking verification status...</span>
        </div>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      headerLabel="Verify Your Email"
      backButtonLabel="Landed here by mistake?"
      backButtonHref="/"
    >
      <div className="flex justify-center flex-col items-center space-y-4">
        {!tokenExpired && (
          <Button
            disabled={tokenExpired || verifying}
            className="w-1/2"
            onClick={handleButtonClick}
          >
            {verifying ? (
              <ScaleLoader />
            ) : verified ? (
              "Go to Login"
            ) : (
              "Verify Email"
            )}
          </Button>
        )}
        {error && <span className="text-red-500">{error}</span>}
      </div>
    </CardWrapper>
  );
};

export default VerifyPage;
