import React from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const list = [1, 2, 3, 4];
const list3 = [1, 2, 3];
const list6 = [1, 2, 3, 4, 5, 6];

export default function BuyerHome() {
    const handleButtonClick = () => {
        try {
            // Simulate a potential error
            const randomNumber = Math.random();
            if (randomNumber < 0.5) {
                throw new Error("Something went wrong!");
            }

            // Show success toast if no error occurs
            toast.success("Successfully Clicked!");
        } catch (error) {
            // Safely access the error message
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unknown error occurred.");
            }
        } finally {
            // Show a toast for finally block or perform other cleanup
            console.log("Execution completed.");
        }
    };

    return (
        <div className="my-8 mx-8">
            <div className="w-full flex justify-center items-center">
                <img src="/images/logo.png" alt="logo" className="w-96 h-96" />
            </div>
            hello
            {/* Button to trigger toast */}
            <div className="mt-4 flex justify-center">
                <button
                    onClick={handleButtonClick}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Open
                </button>
            </div>

            {/* Toast Container to display notifications */}
            <ToastContainer />
        </div>
    );
}
