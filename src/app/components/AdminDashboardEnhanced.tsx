import React, { useState, useEffect } from 'react';
import { User } from '../App';
import { useMockData } from '../utils/MockDataContext';
import { Shield, Users, FileText, CheckCircle, XCircle, Clock, LogOut, Search, Ban, Trash2, AlertTriangle, UserX, UserCheck, Settings, MessageSquare } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type AdminDashboardProps = {
  user: User;
  onLogout: () => void;
};

export function AdminDashboardEnhanced({ user, onLogout }: AdminDashboardProps) {
  const mockData = useMockData();
  const [activeTab, setActiveTab] = useState<'users' | 'files' | 'manage' | 'appeals'>('users');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [banningUserId, setBanningUserId] = useState<string | null>(null);
  const [banReason, setBanReason] = useState('');
  const [reviewingAppealId, setReviewingAppealId] = useState<string | null>(null);
  const [adminResponse, setAdminResponse] = useState('');

  const pendingUsers = mockData.getPendingUsers();
  const allUsers = mockData.getAllUsers().filter(u => !u.isAdmin);
  const allFiles = mockData.getPendingFiles();
  const allAppeals = mockData.getAllAppeals();

  const handleVerifyUser = (userId: string, approve: boolean) => {
    mockData.verifyUser(userId, approve);
    toast.success(approve ? 'User approved successfully' : 'User rejected');
  };

  const handleApproveFile = (fileId: string, approve: boolean) => {
    mockData.approveFile(fileId, approve);
    toast.success(approve ? 'File approved successfully' : 'File rejected');
  };

  const handleDeleteResource = (resourceId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      mockData.deleteResource(resourceId);
      toast.success('Resource deleted successfully');
    }
  };

  const handleBanUser = (userId: string) => {
    if (!banReason.trim()) {
      toast.error('Please provide a reason for banning');
      return;
    }
    mockData.banUser(userId, banReason);
    setBanningUserId(null);
    setBanReason('');
    toast.success('User banned successfully');
  };

  const handleUnbanUser = (userId: string) => {
    mockData.unbanUser(userId);
    toast.success('User unbanned successfully');
  };

  const handleReviewAppeal = (appealId: string, approve: boolean) => {
    if (!adminResponse.trim() && !approve) {
      toast.error('Please provide a response when rejecting an appeal');
      return;
    }
    mockData.reviewAppeal(appealId, approve, adminResponse || undefined);
    setReviewingAppealId(null);
    setAdminResponse('');
    toast.success(approve ? 'Appeal approved and user unbanned' : 'Appeal rejected');
  };

  const filteredPendingUsers = pendingUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAllUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFiles = allFiles.filter(f =>
    f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.uploaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAppeals = allAppeals.filter(a =>
    a.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0D7C7' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E56E20' }}>
                <Shield size={20} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: '#E56E20' }}>
                  Admin Dashboard
                </h1>
                <p className="text-xs text-gray-500">Pass The Paper</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                style={{ backgroundColor: '#E56E20' }}
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-b-2 text-[#E56E20]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === 'users' ? { borderBottomColor: '#E56E20' } : {}}
            >
              <Users size={20} />
              User Verification
              {pendingUsers.length > 0 && (
                <span className="ml-2 px-2 py-1 rounded-full text-xs text-white" style={{ backgroundColor: '#E56E20' }}>
                  {pendingUsers.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'files'
                  ? 'border-b-2 text-[#E56E20]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === 'files' ? { borderBottomColor: '#E56E20' } : {}}
            >
              <FileText size={20} />
              Resources Management
              {allFiles.filter(f => f.status === 'pending').length > 0 && (
                <span className="ml-2 px-2 py-1 rounded-full text-xs text-white" style={{ backgroundColor: '#E56E20' }}>
                  {allFiles.filter(f => f.status === 'pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'manage'
                  ? 'border-b-2 text-[#E56E20]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === 'manage' ? { borderBottomColor: '#E56E20' } : {}}
            >
              <Settings size={20} />
              User Management
            </button>
            <button
              onClick={() => setActiveTab('appeals')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'appeals'
                  ? 'border-b-2 text-[#E56E20]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === 'appeals' ? { borderBottomColor: '#E56E20' } : {}}
            >
              <MessageSquare size={20} />
              Appeals
              {allAppeals.filter(a => a.status === 'pending').length > 0 && (
                <span className="ml-2 px-2 py-1 rounded-full text-xs text-white" style={{ backgroundColor: '#E56E20' }}>
                  {allAppeals.filter(a => a.status === 'pending').length}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  activeTab === 'users' ? 'Search pending users...' :
                  activeTab === 'files' ? 'Search resources...' :
                  activeTab === 'manage' ? 'Search all users...' :
                  'Search appeals...'
                }
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#E56E20' }}></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* User Verification Tab */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                {filteredPendingUsers.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <Users size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No pending user verifications</p>
                  </div>
                ) : (
                  filteredPendingUsers.map((pendingUser) => (
                    <div key={pendingUser.id} className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users size={24} className="text-gray-500" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{pendingUser.name}</h3>
                              <p className="text-sm text-gray-500">{pendingUser.email}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                              <Clock size={14} />
                              Pending
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">University:</span>
                              <p className="font-medium">{pendingUser.university}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Student ID:</span>
                              <p className="font-medium">{pendingUser.studentId}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleVerifyUser(pendingUser.id, true)}
                            className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors hover:opacity-90"
                            style={{ backgroundColor: '#10B981' }}
                          >
                            <CheckCircle size={18} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerifyUser(pendingUser.id, false)}
                            className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors hover:opacity-90"
                            style={{ backgroundColor: '#EF4444' }}
                          >
                            <XCircle size={18} />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Resources Management Tab */}
            {activeTab === 'files' && (
              <div className="space-y-4">
                {filteredFiles.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No resources found</p>
                  </div>
                ) : (
                  filteredFiles.map((file) => (
                    <div key={file.id} className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D4ECF7' }}>
                              <FileText size={24} style={{ color: '#E56E20' }} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{file.title}</h3>
                              <p className="text-sm text-gray-500">Uploaded by {file.uploaderName}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                              file.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              file.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {file.status === 'pending' && <Clock size={14} />}
                              {file.status === 'approved' && <CheckCircle size={14} />}
                              {file.status === 'rejected' && <XCircle size={14} />}
                              {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{file.description}</p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Category:</span>
                              <p className="font-medium">{file.category}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Uploaded:</span>
                              <p className="font-medium">{new Date(file.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <a
                                href={file.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:underline"
                                style={{ color: '#E56E20' }}
                              >
                                View File →
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          {file.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveFile(file.id, true)}
                                className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors hover:opacity-90"
                                style={{ backgroundColor: '#10B981' }}
                              >
                                <CheckCircle size={18} />
                                Approve
                              </button>
                              <button
                                onClick={() => handleApproveFile(file.id, false)}
                                className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors hover:opacity-90"
                                style={{ backgroundColor: '#EF4444' }}
                              >
                                <XCircle size={18} />
                                Reject
                              </button>
                            </div>
                          )}
                          <button
                            onClick={() => handleDeleteResource(file.id, file.title)}
                            className="px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-colors hover:opacity-90"
                            style={{ backgroundColor: '#EF4444' }}
                          >
                            <Trash2 size={18} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* User Management Tab */}
            {activeTab === 'manage' && (
              <div className="space-y-4">
                {filteredAllUsers.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <Users size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No users found</p>
                  </div>
                ) : (
                  filteredAllUsers.map((managedUser) => (
                    <div key={managedUser.id} className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              managedUser.isBanned ? 'bg-red-100' : 'bg-gray-200'
                            }`}>
                              {managedUser.isBanned ? (
                                <UserX size={24} className="text-red-600" />
                              ) : (
                                <Users size={24} className="text-gray-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{managedUser.name}</h3>
                              <p className="text-sm text-gray-500">{managedUser.email}</p>
                            </div>
                            <div className="flex gap-2">
                              {managedUser.isVerified ? (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
                                  <CheckCircle size={14} />
                                  Verified
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                                  <Clock size={14} />
                                  Unverified
                                </span>
                              )}
                              {managedUser.isBanned && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                                  <Ban size={14} />
                                  Banned
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-500">University:</span>
                              <p className="font-medium">{managedUser.university}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Student ID:</span>
                              <p className="font-medium">{managedUser.studentId}</p>
                            </div>
                          </div>
                          {managedUser.isBanned && managedUser.banReason && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                              <p className="text-xs text-red-800">
                                <strong>Ban Reason:</strong> {managedUser.banReason}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          {managedUser.isBanned ? (
                            <button
                              onClick={() => handleUnbanUser(managedUser.id)}
                              className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors hover:opacity-90"
                              style={{ backgroundColor: '#10B981' }}
                            >
                              <UserCheck size={18} />
                              Unban User
                            </button>
                          ) : (
                            <button
                              onClick={() => setBanningUserId(managedUser.id)}
                              className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors hover:opacity-90"
                              style={{ backgroundColor: '#EF4444' }}
                            >
                              <Ban size={18} />
                              Ban User
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Appeals Tab */}
            {activeTab === 'appeals' && (
              <div className="space-y-4">
                {filteredAppeals.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No appeals found</p>
                  </div>
                ) : (
                  filteredAppeals.map((appeal) => (
                    <div key={appeal.id} className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users size={24} className="text-gray-500" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{appeal.userName}</h3>
                              <p className="text-sm text-gray-500">{appeal.userEmail}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                              appeal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              appeal.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {appeal.status === 'pending' && <Clock size={14} />}
                              {appeal.status === 'approved' && <CheckCircle size={14} />}
                              {appeal.status === 'rejected' && <XCircle size={14} />}
                              {appeal.status.charAt(0).toUpperCase() + appeal.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3"><strong>Reason:</strong> {appeal.reason}</p>
                          {appeal.adminResponse && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                              <p className="text-xs text-blue-800">
                                <strong>Admin Response:</strong> {appeal.adminResponse}
                              </p>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Status:</span>
                              <p className="font-medium">{appeal.status.charAt(0).toUpperCase() + appeal.status.slice(1)}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Submitted:</span>
                              <p className="font-medium">{new Date(appeal.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          {appeal.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => setReviewingAppealId(appeal.id)}
                                className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors hover:opacity-90"
                                style={{ backgroundColor: '#E56E20' }}
                              >
                                <MessageSquare size={18} />
                                Respond
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Ban User Modal */}
      {banningUserId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => {
            setBanningUserId(null);
            setBanReason('');
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={24} color="#EF4444" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Ban User</h3>
                <p className="text-sm text-gray-500">Provide a reason for banning this user</p>
              </div>
            </div>

            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Enter ban reason..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-sm resize-none"
              rows={4}
            />

            <div className="flex gap-2">
              <button
                onClick={() => handleBanUser(banningUserId)}
                className="flex-1 px-4 py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: '#EF4444' }}
              >
                Ban User
              </button>
              <button
                onClick={() => {
                  setBanningUserId(null);
                  setBanReason('');
                }}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Respond to Appeal Modal */}
      {reviewingAppealId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => {
            setReviewingAppealId(null);
            setAdminResponse('');
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={24} color="#EF4444" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Respond to Appeal</h3>
                <p className="text-sm text-gray-500">Provide a response to this appeal</p>
              </div>
            </div>

            <textarea
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              placeholder="Enter response..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-sm resize-none"
              rows={4}
            />

            <div className="flex gap-2">
              <button
                onClick={() => handleReviewAppeal(reviewingAppealId, true)}
                className="flex-1 px-4 py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: '#E56E20' }}
              >
                Approve
              </button>
              <button
                onClick={() => handleReviewAppeal(reviewingAppealId, false)}
                className="flex-1 px-4 py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: '#EF4444' }}
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setReviewingAppealId(null);
                  setAdminResponse('');
                }}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}