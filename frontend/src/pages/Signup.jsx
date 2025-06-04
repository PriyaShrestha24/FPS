import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import backgroundImage from "../assets/uni.jpg"; // Background Image


const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student",
        studentId: "",
        university: "",
        program: "",
        year: "1st Year",
        confirmPassword: "",
    });

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // Added to access query parameters
    const [error, setError] = useState(null);
    const [universities, setUniversities] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resendEmail, setResendEmail] = useState(""); // Added for resend functionality
    const [resendMessage, setResendMessage] = useState(""); // Added for resend success message

    // Check for query parameter to display verification failure message
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        if (query.get('error') === 'verification-failed') {
            setError('Email verification failed. The link may be invalid or expired. Please sign up again or resend the verification email.');
        }
    }, [location]);

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/universities/get");
                if (res.data.success) {
                    setUniversities(res.data.universities);
                }
            } catch (err) {
                console.error("Error fetching universities:", err);
            }
        };
        fetchUniversities();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            if (!formData.university) {
                setCourseList([]);
                return;
            }
            try {
                const res = await axios.get(`http://localhost:5000/api/courses/get?universityId=${formData.university}`);
                if (res.data.success) {
                    setCourseList(res.data.courses);
                }
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };
        fetchCourses();
    }, [formData.university]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);
        setError(null);
        setResendMessage(""); // Clear resend message on new signup attempt

        try {
            const response = await axios.post("http://localhost:5000/api/auth/signup", formData);
            if (response.data.success) {
                console.log('Token received on signup:', response.data.token);
                localStorage.setItem("token", response.data.token);
                login(response.data.user, response.data.token);
                setResendEmail(formData.email); // Store email for resending if needed
                navigate('/verify-email');
            }
        } catch (error) {
            setError(error.response?.data?.error || "Signup failed!");
        } finally {
            setLoading(false);
        }
    };

    // Handle resend verification email
    const handleResendVerification = async () => {
        setError("");
        setResendMessage("");
        if (!resendEmail) {
            setError("Please enter the email address you used to sign up.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/auth/resend-verification", { email: resendEmail });
            setResendMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to resend verification email. Please try again.");
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

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                            {error}
                            {error.includes("verification failed") && (
                                <div className="mt-4 space-y-2">
                                    <div className="relative flex items-center border border-gray-300 rounded-md">
                                        <span className="text-gray-600 pl-3 pr-2">✉️</span>
                                        <hr className="h-6 border-l border-gray-300" />
                                        <input
                                            type="email"
                                            value={resendEmail}
                                            onChange={(e) => setResendEmail(e.target.value)}
                                            placeholder="Enter your email to resend"
                                            className="w-full p-2 pl-4 border-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleResendVerification}
                                        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                                    >
                                        Resend Verification Email
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {resendMessage && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                            {resendMessage}
                        </div>
                    )}

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
                            <label className="block text-sm font-medium text-gray-700">University</label>
                            <select
                                name="university"
                                value={formData.university}
                                onChange={handleChange}
                                required
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                            >
                                <option value="">Select University</option>
                                {universities.map((uni) => (
                                    <option key={uni._id} value={uni._id}>
                                        {uni.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Program</label>
                            <select
                                name="program"
                                value={formData.program}
                                onChange={handleChange}
                                required
                                disabled={!formData.university}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                            >
                                <option value="">Select Course</option>
                                {courseList.map((course) => (
                                    <option key={course._id} value={course._id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">Year</label>
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                            >
                                <option value="">Select Year</option>
                                {years.map((year, index) => (
                                    <option key={index} value={year}>{year}</option>
                                ))}
                            </select>
                        </div> */}

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
                            disabled={loading}
                            className={`w-full py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Signing Up...' : 'Sign Up'}
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