import React, { useState, useContext } from "react";
import { PostContext } from "../context/PostContext";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

export default function AddPost() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { createPost } = useContext(PostContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please write a caption for your post");
      return;
    }

    try {
      setIsSubmitting(true);
      await createPost(text, image);
      toast.success("Post created successfully");
      setText("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 w-full md:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Create New Post</h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
                  {/* Caption Section */}
                  <div className="p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What's on your mind?
                    </label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Write something..."
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div className="p-6">
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
                        isDragging
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full aspect-video object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImage(null);
                              setImagePreview(null);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-200"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="text-4xl mb-4">📸</div>
                          <div className="text-gray-600 mb-4">
                            Drag and drop an image here, or{' '}
                            <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                              browse
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                          <p className="text-sm text-gray-500">
                            Supports: JPG, PNG, GIF (Max 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="px-6 py-4 bg-gray-50">
                    <button
                      type="submit"
                      disabled={isSubmitting || (!text.trim() && !image)}
                      className={`w-full flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition duration-200 ${
                        isSubmitting || (!text.trim() && !image)
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Post...
                        </>
                      ) : (
                        'Create Post'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Tips Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-20">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tips for Great Posts</h2>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <span className="text-blue-500 text-xl">📝</span>
                    <p className="text-sm text-gray-600">Keep your captions clear and engaging</p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-blue-500 text-xl">🖼️</span>
                    <p className="text-sm text-gray-600">Use high-quality images for better engagement</p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-blue-500 text-xl">🎯</span>
                    <p className="text-sm text-gray-600">Tag relevant topics to reach your audience</p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-blue-500 text-xl">⏰</span>
                    <p className="text-sm text-gray-600">Post when your audience is most active</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
