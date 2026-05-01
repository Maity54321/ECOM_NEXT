console.log(process.env.NEXT_PUBLIC_MYENV);
export const APIUrl =
  process.env.NEXT_PUBLIC_MYENV === "prod"
    ? "https://mern-ecom-vercel.vercel.app"
    : "http://localhost:4000";
