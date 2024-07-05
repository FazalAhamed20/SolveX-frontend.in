import React, { useState } from "react";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement signup logic here
    console.log("Signup form submitted:", formData);
  };

  const handleGoogleSignup = () => {
    // Implement Google signup logic here
    console.log("Google signup clicked");
  };

  const handleLinkedInSignup = () => {
    // Implement LinkedIn signup logic here
    console.log("LinkedIn signup clicked");
  };

  const handleGitHubSignup = () => {
    // Implement GitHub signup logic here
    console.log("GitHub signup clicked");
  };

  const handleFacebookSignup = () => {
    // Implement Facebook signup logic here
    console.log("Facebook signup clicked");
  };

  return (
    <div className="flex justify-center items-center bg-white py-10 px-4">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex items-center justify-center w-full lg:w-1/2 lg:pl-5">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/7595c4513233f6b0b3c670645bca9de8076d0b9dd73193bbdde534838f5ad586?"
              className="w-full aspect-video lg:aspect-auto"
            />
          </div>
          <div className="flex flex-col w-full lg:w-1/2">
            <div className="flex flex-col p-8 bg-white rounded shadow-lg">
              <div className="text-xl font-bold text-zinc-900">Join us</div>
              <div className="mt-2 text-xl font-bold text-zinc-900">
                Create a SolveX account
              </div>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white rounded border border-gray-400 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white rounded border border-gray-400 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white rounded border border-gray-400 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your password"
                    required
                  />
                </div>
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 bg-white rounded border border-gray-600"
                    required
                  />
                  <div className="ml-2 text-sm leading-7 text-zinc-900">
                    I agree to SolveX Terms of Service and Privacy Policy.
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-3 mt-3 text-sm leading-5 text-white bg-green-700 rounded"
                >
                  Sign up
                </button>
              </form>
              <div className="flex items-center justify-between mt-3 flex-wrap">
                <div className="text-sm leading-7 text-zinc-900">
                  Already have an account?
                </div>
                <div className="flex items-center justify-center px-4 py-2 mt-2 text-sm font-medium leading-6 text-white bg-green-500 rounded-sm w-full lg:w-auto lg:mt-0">
                  <div>Sign In</div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/4b4dd86799c516d59b78dc6ab7ce16a924324c921558d4915043f930cf409d4a?"
                    className="w-[11px] aspect-square ml-2"
                  />
                </div>
              </div>
              <div className="self-center mt-4 text-sm leading-5 text-neutral-300">
                or
              </div>
              <div className="mt-4">
                <button
                  className="w-full px-4 py-2 bg-white rounded border border-gray-400 text-sm leading-5"
                  onClick={handleGoogleSignup}
                >
                  <div className="flex items-center justify-center gap-2">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/589fe21936d246a88bf3409989c1959e4ca43f7be0847947c16cb51553bbba2c?"
                      className="w-[23px] aspect-square"
                    />
                    <div>Continue with Google</div>
                  </div>
                </button>
                <div className="flex flex-wrap gap-3 mt-3">
                  <button
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white rounded border border-gray-400 flex-1"
                    onClick={handleLinkedInSignup}
                  >
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/15b9d1b7d3a3462c8704392710c1884f11a7b534e97f97db5125527ad34339e8?"
                      className="w-[23px] aspect-square"
                    />
                    <div>LinkedIn</div>
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white rounded border border-gray-400 flex-1"
                    onClick={handleGitHubSignup}
                  >
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/973def7342300a36b6dec382e0b89b4c6d6d6e9210ba1d867dfeae2af0440fcf?"
                      className="w-6 aspect-square"
                    />
                    <div>GitHub</div>
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white rounded border border-gray-400 flex-1"
                    onClick={handleFacebookSignup}
                  >
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/f83774a3dd6803fb37aba08ce8c27d8f2fa7689111287cf0fd4aab05ead17699?"
                      className="w-[23px] aspect-square"
                    />
                    <div>Facebook</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
