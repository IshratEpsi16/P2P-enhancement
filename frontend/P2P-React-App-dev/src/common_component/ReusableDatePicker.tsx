import React, { useState } from 'react';
// import Datepicker from "tailwind-datepicker-react"
import Datepicker from "tailwind-datepicker-react";
interface ReusableDatepickerProps {
    options: {
        title: string;
        autoHide: boolean;
        todayBtn: boolean;
        clearBtn: boolean;
        maxDate: Date;
        minDate: Date;
        theme: {
            background: string;
            todayBtn: string;
            clearBtn: string;
            icons: string;
            text: string;
            disabledText: string;
            input: string;
            inputIcon: string;
            selected: string;
        };
        icons: {
            prev: () => React.ReactElement | JSX.Element;
            next: () => React.ReactElement | JSX.Element;
        };
        datepickerClassNames: string;
        defaultDate: Date;
        language: string;
    };
}

const ReusableDatepicker: React.FC<ReusableDatepickerProps> = ({ options }) => {
    const [show, setShow] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleChange = (selectedDate: Date) => {
        setSelectedDate(selectedDate);
        console.log(selectedDate);
    };

    const handleClose = (state: boolean) => {
        setShow(state);
    };

    return (
        <div>
            {/* Render your Datepicker here using the provided options */}
            <div>
                <Datepicker options={options} onChange={handleChange} show={show} setShow={handleClose}>
                    <div className="...">
                        <div className="...">

                        </div>
                        <input
                            type="text"
                            className="..."
                            placeholder="Select Date"
                            value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ''}
                            onFocus={() => setShow(true)}

                        />
                    </div>
                </Datepicker>
            </div>
        </div>
    );
};

export default ReusableDatepicker;
