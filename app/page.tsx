import { auth, signOut } from "@/auth";
import LoginButton from "@/components/Auth/LoginButton";
import { Button } from "@/components/ui/button";
import React from "react";

const Home = async () => {
  const session = await auth();
  return (
    <main className="flex min-h-[100vh] items-center justify-center bg-gradient-shade">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-semibold text-white drop-shadow-md">
          🔐Auth
        </h1>
        <p className="text-white text-lg">A Simple Authentication service</p>
        <div>
          {session ? (
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button variant="secondary" size={"lg"}>
                Sign Out
              </Button>
            </form>
          ) : (
            <LoginButton asChild>
              <Button variant="secondary" size={"lg"}>
                Sign In
              </Button>
            </LoginButton>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
