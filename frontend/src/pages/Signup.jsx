import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import backgroundImage from "../assets/uni.jpg"; // Background Image

//const programs = ["BSc Computing", "BBA", "BSc Cyber Security", "BSc AI & Data Science"]; // Example courses
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"]

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student",
        studentId: "",
        program: "",
        year:""
    });

    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    
    const [courseList, setCourseList] = useState([]);

    useEffect(() => {
    const fetchCourses = async () => {
        try {
        const res = await axios.get("http://localhost:5000/api/courses");
        if (res.data.success) {
            setCourseList(res.data.courses);
        }
        } catch (err) {
        console.error("Error fetching courses:", err);
        }
    };

    fetchCourses();
    }, []);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/auth/signup", formData);
            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                login(response.data.user); // Update auth context
                alert("Signup Successful!");
                navigate(response.data.user.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
            }
        } catch (error) {
            setError(error.response?.data?.error || "Signup failed!");
        }
    };

    return (
        <div className="flex min-h-screen overflow-hidden relative">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-50"
                style={{ backgroundImage: `url(${backgroundImage})` }} 
            ></div>

            <div className="flex-1 flex flex-col justify-center items-center p-6 z-10">
                <div className="bg-white bg-opacity-90 p-8 rounded-lg max-w-md w-full">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">FeeStream</h2>
                    <p className="text-gray-600 mb-6">Create a new account</p>
                    
                    {error && <p className="text-red-500">{error}</p>}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative flex items-center border border-gray-300 rounded-md">
                            <span className="text-gray-600 pl-3 pr-2">👤</span>
                            <hr className="h-6 border-l border-gray-300" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full p-2 pl-4 border-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                             />
                        </div>


                        <div className="relative flex items-center border border-gray-300 rounded-md">
                            <span className="text-gray-600 pl-3 pr-2">✉️</span>
                            <hr className="h-6 border-l border-gray-300" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full p-2 pl-4 border-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700">Program</label>
                            <select name="program" value={formData.program} onChange={handleChange} required
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500">
                                 <option value="">Select Course</option>
                                {courseList.map((course) => (
                                <option key={course._id} value={course._id}>
                                    {course.name}
                                </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Year</label>
                            <select name="year" value={formData.year} onChange={handleChange} required
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500">
                                <option value="">Select Year</option>
                                {years.map((year, index) => (
                                    <option key={index} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        {/* <div className="relative">
                            <label className="block text-sm font-medium text-gray-700">Select Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            >
                                <option value="student">Student</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div> */}

                        {/* Show Student ID and Program fields only if role is "student" */}
                        {formData.role === "student" && (
                            <>
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700">Student ID</label>
                                    <input
                                        type="text"
                                        name="studentId"
                                        placeholder="Enter your Student ID"
                                        value={formData.studentId}
                                        onChange={handleChange}
                                        required
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>
                            </>
                        )}

                        <div className="relative flex items-center border border-gray-300 rounded-md">
                        <span className="text-gray-600 pl-3 pr-2">🔒</span>
                        <hr className="h-6 border-l border-gray-300" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full p-2 pl-4 border-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        </div>


                        <div className="relative flex items-center border border-gray-300 rounded-md">
                            <span className="text-gray-600 pl-3 pr-2">🔒</span>
                            <hr className="h-6 border-l border-gray-300" />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full p-2 pl-4 border-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>




                        <button
                            type="submit"
                            className="w-full py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
                        >
                            Sign Up
                        </button>

                        <div className="text-center mt-4">
                            <span className="text-gray-600">Already have an account?</span>
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="mt-2 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                            >
                                Login now
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
