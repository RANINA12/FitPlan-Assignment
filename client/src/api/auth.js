
import api from "./axios";
export const fetchDataforUnloggedUser = async () => {
    return api.get("/api/dashboard/public", {});
};

export const fetchDataforloggedUser = async (Email) => {
    return api.get("/api/dashboard/user", {
        params: { Email },
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        withCredentials: true
    });
};

export const FollowRequest = async (EmailTrainer, EmailUser) => {

    return api.post("/api/subscribe", {
        EmailTrainer: EmailTrainer, EmailUser: EmailUser,
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        withCredentials: true
    });
}

export const unFollowRequest = async (EmailTrainer, EmailUser) => {
    return api.post("/api/unsubscribe", {
        EmailTrainer: EmailTrainer, EmailUser: EmailUser,
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        withCredentials: true
    });
}

export const buyProduct = async (validationcode, Email, TrainerPlanId) => {

    return api.post("/api/buy-plan", {
        validationcode: validationcode, Email: Email, TrainerPlanId: TrainerPlanId,
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        withCredentials: true
    });
}

export const uploadnewPlans = async () => {

}

export const editExitingPlan = async () => {

}

export const deletePlan = async () => {

}

export const getAllPlans = async (Email) => {
    return api.get("/api/fetch/AllPlans", {
        params: { Email },
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        withCredentials: true
    });
}
export const showSuscriberlist = async () => {

}
export const showpurchasedplan = async () => {

}

export const loginApi = async (Email, Password) => {
    return api.post("/api/Login", {
        Email: Email,
        Password: Password
    });
};


export const registerApi = async (Email, Password, ConfirmPassword, role) => {
    return api.post("/api/Register", {
        Email: Email,
        Password: Password,
        ConfirmPassword: ConfirmPassword,
        Role: role,
    });
}


export const GoogleSignUpApi = async (Email) => {
    return api.post("/api/Google/Login", {
        Email: Email,
    });
}


export const otpSendApi = async (Email) => {
    return api.post("/api/otp/send", {
        Email: Email,

    });
}

export const verifyOtpApi = async (Email, Otp) => {
    return api.post("/api/otp/verify", {
        Email: Email,
        Otp: Otp
    });
}

export const passwordRecoveryApi = async (Email) => {
    return api.post("/api/PasswordRecovery", {
        Email: Email,

    });
}

export const resetPasswordApi = async (Email, NewPassword) => {
    return api.post("/api/ResetPassword", {
        Email: Email,
        NewPassword: NewPassword
    });
}