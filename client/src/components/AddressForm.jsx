import React, { useState } from "react";
import { addNewAddress, getCurrentUser } from "../APICalls/userCalls";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function AddressForm({ setShowAddressForm }) {
    const dispatch = useDispatch();

    const [newAddress, setNewAddress] = useState({
    type: "home",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    isDefaultAddr: false,
    });

    const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
        setNewAddress((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "radio") {
        setNewAddress((prev) => ({ ...prev, [name]: value }));
    } else {
        setNewAddress((prev) => ({ ...prev, [name]: value }));
    }
    };

    const resetAddressForm = () => {
    setNewAddress({
        type: "home",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
    });
    };

    const handleAddressSubmit = async (e) => {
    e.preventDefault();

    try {
        await addNewAddress(newAddress);
        
        const updatedUser = await getCurrentUser();
        dispatch(setUserData(updatedUser.user));
        
        resetAddressForm();
        setShowAddressForm(false);        
    } catch (error) {
        console.error("Address submission error:", error);
    }
    };

    return (
    <>
        <div className="mt-6 bg-white border border-gray-200 rounded-md p-6">
        <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-lg">Add New Address</h4>
        </div>

        <form
            onSubmit={handleAddressSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
            {/* Address Type */}
            <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Type*
            </label>
            <div className="flex space-x-4">
                <label className="inline-flex items-center">
                <input
                    type="radio"
                    name="type"
                    value="home"
                    checked={newAddress.type === "home"}
                    onChange={handleAddressChange}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2 text-gray-700">Home</span>
                </label>
                <label className="inline-flex items-center">
                <input
                    type="radio"
                    name="type"
                    value="work"
                    checked={newAddress.type === "work"}
                    onChange={handleAddressChange}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2 text-gray-700">Work</span>
                </label>
                <label className="inline-flex items-center">
                <input
                    type="radio"
                    name="type"
                    value="other"
                    checked={newAddress.type === "other"}
                    onChange={handleAddressChange}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2 text-gray-700">Other</span>
                </label>
            </div>
            </div>

            <div className="md:col-span-2">
            <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="street"
            >
                Street Address*
            </label>
            <input
                type="text"
                id="street"
                name="street"
                value={newAddress.street}
                onChange={handleAddressChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
            </div>

            <div>
            <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="city"
            >
                City*
            </label>
            <input
                type="text"
                id="city"
                name="city"
                value={newAddress.city}
                onChange={handleAddressChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
            </div>

            <div>
            <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="state"
            >
                State/Province*
            </label>
            <input
                type="text"
                id="state"
                name="state"
                value={newAddress.state}
                onChange={handleAddressChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
            </div>

            <div>
            <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="zipCode"
            >
                ZIP/Postal Code*
            </label>
            <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={newAddress.zipCode}
                onChange={handleAddressChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
            </div>

            <div>
            <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="country"
            >
                Country*
            </label>
            <input
                type="text"
                id="country"
                name="country"
                value={newAddress.country}
                onChange={handleAddressChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
            </div>

            <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
            <button
                type="button"
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => {
                resetAddressForm();
                setShowAddressForm((value) => !value);
                }}
            >
                Cancel
            </button>
            <button
                type="submit"
                className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
            >
                Save Address
            </button>
            </div>
        </form>
        </div>
    </>
    );
}

export default AddressForm;
