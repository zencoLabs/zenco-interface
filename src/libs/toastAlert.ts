import React from "react";
import { toast } from "react-toastify";

export function toastInfo(state: boolean, msg: string) {

    if (state) {
        toast.success(msg, {
            autoClose: 5000,
            position: "top-right",
            theme: 'light',
            closeOnClick: true, 
            style: { borderRadius: '6px' },
        });
    } else {
        toast.error(`${msg}`, {
            autoClose: 2500,
            position: "top-right",
            theme: 'light',
            closeOnClick: true, 
            style: { borderRadius: '6px' },
        });
    }

}

export function toastInfo_Html(state: boolean, msg: React.ReactNode) {

    if (state) {
        toast.success(msg, {
            autoClose: 5000,
            position: "top-right",
            theme: 'light',
            closeOnClick: true, 
            style: { borderRadius: '6px' },
        });
    } else {
        toast.error(`${msg}`, {
            autoClose: 2500,
            position: "top-right",
            theme: 'light',
            closeOnClick: true, 
            style: { borderRadius: '6px' },
        });
    }

}