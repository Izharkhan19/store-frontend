import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { apiCall } from "../../services/Axiosservice";
// import { API_URL } from "../../services/Apiroute";
// import { commonService } from "../../utils/commonService";
import { loginUser } from "../../api-services/apiService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //     e.preventDefault();
  //     setLoading(true)
  //     let resData = await apiCall(
  //         {
  //             method: "POST",
  //             url: API_URL.AUTH.LOGIN,
  //             body: {
  //                 email: email,
  //                 password: password,
  //             },
  //         },
  //         false
  //     );
  //     if (resData?.success) {
  //         localStorage.setItem('adminToken', resData?.data?.token);
  //         localStorage.setItem('user', JSON.stringify(resData?.data?.user));
  //         // commonService?.setEncryptData("adminToken", resData?.data?.token)
  //         // commonService?.setEncryptData("userInfo", JSON.stringify(resData?.data?.user))
  //         navigate("/admin/");
  //         setLoading(false)
  //     } else {
  //         alert("Invalid credentials");
  //         setLoading(false)
  //     }

  // };

  const handleLogin = async () => {
    const result = await loginUser({
      email: email,
      password: password,
    }); // Your API call
    if (result.success) {
      localStorage.setItem("adminToken", result?.data?.data?.token);
      localStorage.setItem("token", result?.data?.data?.token); // For shared API use
      localStorage.setItem("user", JSON.stringify(result?.data?.data?.user)); // { role: 'admin', ... }
      navigate("/admin"); // Goes to Dashboard
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 sm:px-6 lg:px-8">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 px-6 sm:px-10 py-8 sm:py-12 rounded-2xl shadow-2xl w-full max-w-md sm:w-96 text-white">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
          Admin Login
        </h2>

        <div className="mb-5 sm:mb-6">
          <label className="text-sm text-gray-300 mb-1.5 block">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3.5 sm:p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-base"
            required
          />
        </div>

        <div className="mb-6 sm:mb-8">
          <label className="text-sm text-gray-300 mb-1.5 block">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3.5 sm:p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-base"
            required
          />
        </div>

        <button
          disabled={loading}
          onClick={handleLogin}
          type="submit"
          className="w-full bg-blue-600 py-3.5 sm:py-3 rounded-lg text-white font-semibold hover:bg-blue-700 transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed text-base sm:text-sm"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        {/* <p className="text-xs sm:text-sm text-center mt-5 sm:mt-6 text-gray-300">
        Demo: admin@example.com / admin123
      </p> */}
        <p className="text-xs sm:text-sm text-center mt-5 sm:mt-6 text-gray-300">
          <Link
            to="/login"
            state={{ from: location.state?.from }}
            className="font-semibold text-amber-700 hover:text-amber-800 transition-colors"
          >
            Back to Client Login
          </Link>
        </p>
      </div>
    </div>
  );
}
