"use client";

import CardWrapper from "../CardWrapper";
import { useForm } from "react-hook-form";
import z, { set } from "zod";
import { loginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useEffect, useState, useTransition } from "react";
import { Button } from "../ui/button";
import FormError from "../FormMessages/FormError";
import FormSuccess from "../FormMessages/FormSuccess";
import { login, LoginResponse } from "@/lib/actions/login";
import { useRouter, useSearchParams } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState({
    message: "",
    type: "",
  });
  const [isPending, startTransiton] = useTransition();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (searchParams.get("error") === "OAuthAccountNotLinked") {
      setError({
        message:
          "OAuth account not linked. Please sign in with your original provider.",
        type: "error",
      });
    }
  }, [searchParams]);

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    startTransiton(async () => {
      const res: LoginResponse = await login(values);

      if (res?.error) {
        setError({
          message: res.message as string,
          type: "error",
        });
      } else {
        setError({
          message: res.message as string,
          type: "success",
        });
        const callbackUrl = searchParams.get("callbackUrl");
        if (callbackUrl) {
          router.push(callbackUrl);
        } else {
          router.push("/");
        }
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back!"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {error.type === "error" && <FormError message={error.message} />}
          {error.type === "success" && <FormSuccess message={error.message} />}

          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
