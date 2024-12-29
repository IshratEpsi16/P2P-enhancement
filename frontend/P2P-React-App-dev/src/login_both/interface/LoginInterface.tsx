// LoginInterface.tsx
interface LoginInterface {
    token: string;
    message: string;
    status: number;  // Make it non-nullable
    isBuyer?: number | null;
    // Add any other properties as needed
}


export default LoginInterface;
