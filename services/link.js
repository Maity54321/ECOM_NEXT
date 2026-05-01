console.log(process.env.NEXT_PUBLIC_MYENV);
export const APIUrl =
  process.env.NEXT_PUBLIC_MYENV === "prod"
    ? "https://mern-ecom-vercel.vercel.app"
    : "https://mern-ecom-vercel.vercel.app";
