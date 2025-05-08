import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { validatePlanForm } from "../../../utils/validations/PlanValidation";
import "./addPlan.css";
import { useGetPlanById } from "../../../hooks/useGetPlanByid";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdatePlan } from "../../../hooks/useUpdatePlan";
const EditPlan = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    console.log("edit plan id: ", id);
    const { data: user } = useGetPlanById(id || '');
    const { mutate, isLoading } = useUpdatePlan();
    const [formData, setFormData] = useState({
        name: "",
        type: "paid",
        description: "",
        regularAmount: 0,
        discountAmount: 0,
        benefits: [],
        isListed: true,
        duration: "1 month",
        roomBenefit: 0,
    });
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                type: user.type || 'paid',
                description: user.description || '',
                regularAmount: user.regularAmount || '',
                discountAmount: user.discountAmount || '',
                benefits: user.benefits || '',
                isListed: Boolean(user.isListed),
                duration: user.duration || '1 month',
                roomBenefit: user.roomBenefit || 0,
            });
        }
    }, [user]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "isListed" ? value === "true" : name === "roomBenefit" ? Number(value) : value
        }));
    };
    const handleBenefitsChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            benefits: e.target.value.split("\n"),
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validatePlanForm(formData))
            return;
        if (id) {
            mutate({ id, planData: formData }, {
                onSuccess: () => {
                    navigate('/plans');
                }
            });
        }
    };
    if (isLoading)
        return _jsx("p", { children: "Loading..." });
    return (_jsx("div", { className: "form-container", children: _jsxs("div", { className: "form-card", children: [_jsx("h2", { className: "form-heading", children: "Edit Plan" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "name", className: "form-label", children: "Name" }), _jsx("input", { type: "text", id: "name", name: "name", value: formData.name, onChange: handleChange, className: "form-input", placeholder: "Enter plan name" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "type", className: "form-label", children: "Type" }), _jsxs("select", { id: "type", name: "type", value: formData.type, onChange: handleChange, className: "form-select", children: [_jsx("option", { value: "paid", children: "Paid" }), _jsx("option", { value: "free", children: "Free" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "description", className: "form-label", children: "Description" }), _jsx("textarea", { id: "description", name: "description", value: formData.description, onChange: handleChange, className: "form-textarea", placeholder: "Enter plan description" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "roomBenefit", className: "form-label", children: "Room Benefit" }), _jsx("input", { type: "number", id: "roomBenefit", name: "roomBenefit", value: formData.roomBenefit, onChange: handleChange, className: "form-input", placeholder: "Enter number of extra rooms (0-20)", min: "0", max: "20" })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group half-width", children: [_jsx("label", { htmlFor: "regularAmount", className: "form-label", children: "Regular Amount" }), _jsx("input", { type: "number", id: "regularAmount", name: "regularAmount", value: formData.regularAmount, onChange: handleChange, className: "form-input", placeholder: "Enter regular amount" })] }), _jsxs("div", { className: "form-group half-width", children: [_jsx("label", { htmlFor: "discountAmount", className: "form-label", children: "Discount Amount" }), _jsx("input", { type: "number", id: "discountAmount", name: "discountAmount", value: formData.discountAmount, onChange: handleChange, className: "form-input", placeholder: "Enter discount amount" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "benefits", className: "form-label", children: "Benefits" }), _jsx("textarea", { id: "benefits", name: "benefits", value: formData.benefits.join("\n"), onChange: handleBenefitsChange, className: "form-textarea", placeholder: "Enter benefits (one per line)" })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group half-width", children: [_jsx("label", { htmlFor: "duration", className: "form-label", children: "Duration" }), _jsxs("select", { id: "duration", name: "duration", value: formData.duration, onChange: handleChange, className: "form-select", children: [_jsx("option", { value: "1 month", children: "1 Month" }), _jsx("option", { value: "3 months", children: "3 Months" }), _jsx("option", { value: "6 months", children: "6 Months" }), _jsx("option", { value: "9 months", children: "9 Months" }), _jsx("option", { value: "12 months", children: "12 Months" })] })] }), _jsxs("div", { className: "form-group half-width", children: [_jsx("label", { htmlFor: "isListed", className: "form-label", children: "Status" }), _jsxs("select", { id: "isListed", name: "isListed", value: String(formData.isListed), onChange: handleChange, className: "form-select", children: [_jsx("option", { value: "true", children: "Active" }), _jsx("option", { value: "false", children: "Inactive" })] })] })] }), _jsx("button", { type: "submit", className: "form-button", disabled: isLoading, children: isLoading ? "Editing..." : "Edit Plan" })] })] }) }));
};
export default EditPlan;
