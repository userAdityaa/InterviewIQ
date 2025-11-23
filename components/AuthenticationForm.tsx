"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormInputField from "@/components/FormInputField";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebaseConfig/client";
import { signIn, signUp } from "@/lib/services/auth.action";

const authFormSchema = (type: FormType) =>
  z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string(),
    email: z.string().email(),
    password: z.string().min(3),
  });

const AuthenticationForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully! Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = values;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Invalid login");
          return;
        }

        await signIn({ email, idToken });

        toast.success("Sign in successful!");
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong! Please try again.");
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div
      className="glass-card rounded-xl shadow-md p-10 max-w-md mx-auto"
      style={{
        background: 'rgba(255,255,255,0.07)', // more transparent
        backdropFilter: 'blur(32px) saturate(220%)', // stronger blur
        WebkitBackdropFilter: 'blur(32px) saturate(220%)',
        borderRadius: '1rem',
        border: '1px solid rgba(255,255,255,0.18)', // lighter border
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)', // softer shadow
      }}
    >
      <div className="flex flex-col gap-6">
        {/* Title only, no logo */}
        <h3 className="text-center text-white font-medium">
          Practice job interview with AI
        </h3>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {!isSignIn && (
              <FormInputField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your name"
              />
            )}

            <FormInputField
              control={form.control}
              name="email"
              label="Email"
              placeholder="you@example.com"
              type="email"
            />

            <FormInputField
              control={form.control}
              name="password"
              label="Password"
              placeholder="••••••••"
              type="password"
            />

            <Button
              className="w-full py-3 font-semibold rounded-md
                         bg-[#C7F2A7] text-[#1A1A1A]
                         hover:bg-[#FFF6BD] transition-all"
              type="submit"
            >
              {isSignIn ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </Form>

        {/* Switch Sign in / Sign up */}
        <p className="text-center text-white">
          {isSignIn ? "New here?" : "Already have an account?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="ml-2 underline font-semibold text-[#C7F2A7] hover:text-[#FFF6BD] transition-all"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthenticationForm;
