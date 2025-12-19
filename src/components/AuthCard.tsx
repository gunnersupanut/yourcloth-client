interface AuthCardProps {
  children: React.ReactNode;
}
const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <div className="w-full max-w-md bg-primary rounded-[25px] p-8 h-[583.25px] flex flex-col items-center overflow-y-auto relative">
      <p className="font-logo text-[32px] text-secondary drop-shadow-md">YourCloth</p>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default AuthCard;
