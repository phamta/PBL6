(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/lib/api.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/**
 * API Configuration and Utilities
 * Centralized API configuration for the application
 */ __turbopack_context__.s({
    "API_BASE_URL": ()=>API_BASE_URL,
    "API_ENDPOINTS": ()=>API_ENDPOINTS,
    "APP_CONFIG": ()=>APP_CONFIG,
    "api": ()=>api,
    "apiClient": ()=>apiClient,
    "authApi": ()=>authApi,
    "buildApiUrl": ()=>buildApiUrl,
    "downloadFile": ()=>downloadFile
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:3001/api/v1") || 'http://localhost:3001/api/v1';
// Create axios instance with default configuration
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});
// Request interceptor
apiClient.interceptors.request.use((config)=>{
    var _config_method;
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = "Bearer ".concat(token);
    }
    console.log("🚀 API Request: ".concat((_config_method = config.method) === null || _config_method === void 0 ? void 0 : _config_method.toUpperCase(), " ").concat(config.url));
    return config;
}, (error)=>{
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
});
// Response interceptor
apiClient.interceptors.response.use((response)=>{
    var _response_config_method;
    console.log("✅ API Response: ".concat((_response_config_method = response.config.method) === null || _response_config_method === void 0 ? void 0 : _response_config_method.toUpperCase(), " ").concat(response.config.url, " - ").concat(response.status));
    return response;
}, (error)=>{
    var _error_response;
    console.error('❌ Response Error:', error);
    if (((_error_response = error.response) === null || _error_response === void 0 ? void 0 : _error_response.status) === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
;
const API_ENDPOINTS = {
    // Authentication
    auth: {
        login: '/auth/login',
        logout: '/auth/logout',
        profile: '/auth/profile',
        refresh: '/auth/refresh'
    },
    // Admin endpoints
    admin: {
        users: '/admin/users',
        roles: '/admin/roles',
        systemLogs: '/admin/system-logs',
        statistics: '/admin/statistics'
    },
    // Module endpoints
    mou: {
        base: '/mou',
        export: '/reports/mou/excel'
    },
    visa: {
        base: '/visa',
        export: '/reports/visa/excel'
    },
    visitor: {
        base: '/visitor',
        export: '/reports/visitor/excel'
    },
    translation: {
        base: '/translation',
        export: '/reports/translation/excel'
    },
    // Report endpoints
    reports: {
        dashboard: '/reports/dashboard',
        export: '/reports/export'
    }
};
const api = {
    // GET request
    get: async (url, config)=>{
        const response = await apiClient.get(url, config);
        return response.data;
    },
    // POST request
    post: async (url, data, config)=>{
        const response = await apiClient.post(url, data, config);
        return response.data;
    },
    // PUT request
    put: async (url, data, config)=>{
        const response = await apiClient.put(url, data, config);
        return response.data;
    },
    // PATCH request
    patch: async (url, data, config)=>{
        const response = await apiClient.patch(url, data, config);
        return response.data;
    },
    // DELETE request
    delete: async (url, config)=>{
        const response = await apiClient.delete(url, config);
        return response.data;
    }
};
const authApi = {
    login: async (credentials)=>{
        return api.post(API_ENDPOINTS.auth.login, credentials);
    },
    logout: async ()=>{
        return api.post(API_ENDPOINTS.auth.logout);
    },
    getProfile: async ()=>{
        return api.get(API_ENDPOINTS.auth.profile);
    },
    refreshToken: async ()=>{
        return api.post(API_ENDPOINTS.auth.refresh);
    }
};
const buildApiUrl = (endpoint, params)=>{
    const url = new URL(endpoint, API_BASE_URL);
    if (params) {
        Object.entries(params).forEach((param)=>{
            let [key, value] = param;
            url.searchParams.append(key, String(value));
        });
    }
    return url.toString();
};
const downloadFile = async (endpoint, filename)=>{
    const token = localStorage.getItem('token');
    const response = await fetch(buildApiUrl(endpoint), {
        headers: {
            'Authorization': "Bearer ".concat(token)
        }
    });
    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } else {
        throw new Error('Download failed');
    }
};
const APP_CONFIG = {
    name: ("TURBOPACK compile-time value", "Hệ thống Quản lý Hợp tác Quốc tế") || 'Hệ thống Quản lý Hợp tác Quốc tế',
    universityName: ("TURBOPACK compile-time value", "Trường Đại học Bách Khoa Đà Nẵng") || 'Trường Đại học Bách Khoa Đà Nẵng',
    version: '1.0.0',
    pagination: {
        defaultPageSize: 10,
        maxPageSize: 100
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/auth.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "authHelpers": ()=>authHelpers,
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
;
const authHelpers = {
    // Login with API
    login: async (credentials)=>{
        try {
            console.log('🔑 Attempting login...', {
                email: credentials.email
            });
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].login(credentials);
            // Backend trả về trực tiếp { access_token, user }, không có wrapper
            if (response.access_token && response.user) {
                authHelpers.setToken(response.access_token);
                authHelpers.setUser(response.user);
                console.log('✅ Login successful');
                return {
                    success: true,
                    data: response,
                    message: 'Login successful'
                };
            }
            console.log('❌ Login failed: Invalid response format');
            return {
                success: false,
                message: 'Invalid response from server'
            };
        } catch (error) {
            var _error_response_data, _error_response, _error_response_data1, _error_response1;
            console.error('❌ Login error:', error);
            return {
                success: false,
                message: ((_error_response = error.response) === null || _error_response === void 0 ? void 0 : (_error_response_data = _error_response.data) === null || _error_response_data === void 0 ? void 0 : _error_response_data.message) || error.message || 'Login failed',
                errors: ((_error_response1 = error.response) === null || _error_response1 === void 0 ? void 0 : (_error_response_data1 = _error_response1.data) === null || _error_response_data1 === void 0 ? void 0 : _error_response_data1.errors) || [
                    error.message
                ]
            };
        }
    },
    // Token management
    setToken: (token)=>{
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem('token', token);
            // Also set as cookie for middleware
            document.cookie = "token=".concat(token, "; path=/; max-age=86400"); // 24 hours
        }
    },
    getToken: ()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            return localStorage.getItem('token');
        }
        //TURBOPACK unreachable
        ;
    },
    removeToken: ()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem('token');
            // Remove cookie
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        }
    },
    // User management
    setUser: (user)=>{
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem('user', JSON.stringify(user));
            // Also set as cookie for middleware
            document.cookie = "user=".concat(encodeURIComponent(JSON.stringify(user)), "; path=/; max-age=86400"); // 24 hours
        }
    },
    getUser: ()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        }
        //TURBOPACK unreachable
        ;
    },
    removeUser: ()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem('user');
            // Remove cookie
            document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        }
    },
    // Authentication checks
    isAuthenticated: ()=>{
        // Check if user is authenticated by looking for token in localStorage
        if ("TURBOPACK compile-time truthy", 1) {
            return !!localStorage.getItem('token');
        }
        //TURBOPACK unreachable
        ;
    },
    requireAuth: ()=>{
        return {
            isLoading: false,
            user: null
        };
    },
    // Role and permission checks
    hasRole: (requiredRole, userRole)=>{
        return userRole === requiredRole || userRole === 'admin';
    },
    hasPermission: (permission, userRole)=>{
        // Simple permission check - admin has all permissions
        return userRole === 'admin';
    },
    // Mock login for demo (keeping this for backward compatibility)
    mockLogin: (role)=>{
        const mockUser = {
            id: 1,
            username: 'demo_user',
            email: 'demo@example.com',
            role: role,
            name: 'Demo User'
        };
        const mockToken = 'mock_token_' + Date.now();
        authHelpers.setToken(mockToken);
        authHelpers.setUser(mockUser);
    },
    // Logout
    logout: ()=>{
        authHelpers.removeToken();
        authHelpers.removeUser();
        if ("TURBOPACK compile-time truthy", 1) {
            window.location.href = '/login';
        }
    }
};
const __TURBOPACK__default__export__ = authHelpers;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/hooks/usePermissions.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "UserRole": ()=>UserRole,
    "usePermissions": ()=>usePermissions
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-client] (ecmascript)");
;
const UserRole = {
    ADMIN: 'admin',
    USER: 'user',
    STUDENT: 'student',
    SPECIALIST: 'specialist',
    MANAGER: 'manager',
    VIEWER: 'viewer',
    SYSTEM: 'system'
};
// Role-Permission Mapping (matching backend)
const ROLE_PERMISSIONS = {
    [UserRole.ADMIN]: [
        // Full system access
        'user:create',
        'user:read',
        'user:update',
        'user:delete',
        'user:assign_role',
        'system:config',
        'system:backup',
        'system:logs',
        'data:view_all',
        'report:view',
        'report:export',
        'report:stats',
        'notification:manage',
        // All module permissions
        'visa:create',
        'visa:read',
        'visa:update',
        'visa:delete',
        'visa:review',
        'visa:approve',
        'visa:reject',
        'visa:assign',
        'visa:export',
        'mou:create',
        'mou:read',
        'mou:update',
        'mou:delete',
        'mou:review',
        'mou:approve',
        'mou:sign',
        'mou:terminate',
        'mou:assign',
        'mou:export',
        'translation:create',
        'translation:read',
        'translation:update',
        'translation:delete',
        'translation:review',
        'translation:approve',
        'translation:certify',
        'visitor:create',
        'visitor:read',
        'visitor:update',
        'visitor:delete',
        'visitor:approve',
        'visitor:export'
    ],
    [UserRole.USER]: [
        // Department level access
        'data:view_department',
        'visa:create',
        'visa:read',
        'visa:update',
        'mou:create',
        'mou:read',
        'mou:update',
        'translation:create',
        'translation:read',
        'translation:update',
        'visitor:create',
        'visitor:read',
        'visitor:update'
    ],
    [UserRole.STUDENT]: [
        // Own data only access
        'data:view_own',
        'visa:create',
        'visa:read',
        'visa:update'
    ],
    [UserRole.SPECIALIST]: [
        // Processing and review access
        'data:view_all',
        'visa:read',
        'visa:review',
        'visa:assign',
        'mou:read',
        'mou:review',
        'mou:assign',
        'translation:read',
        'translation:review',
        'translation:certify',
        'visitor:read',
        'visitor:update',
        'report:view',
        'report:export'
    ],
    [UserRole.MANAGER]: [
        // Approval level access
        'data:view_all',
        'visa:read',
        'visa:approve',
        'visa:reject',
        'visa:export',
        'mou:read',
        'mou:approve',
        'mou:sign',
        'mou:terminate',
        'mou:export',
        'translation:read',
        'translation:approve',
        'visitor:read',
        'visitor:approve',
        'visitor:export',
        'report:view',
        'report:export',
        'report:stats'
    ],
    [UserRole.VIEWER]: [
        // Read-only public access
        'data:view_public',
        'visa:read',
        'mou:read',
        'translation:read',
        'visitor:read',
        'report:view'
    ],
    [UserRole.SYSTEM]: [
        // System automation access
        'notification:send',
        'data:view_all',
        'visa:read',
        'mou:read'
    ]
};
const usePermissions = ()=>{
    const user = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authHelpers"].getUser();
    /**
   * Check if current user has a specific permission
   */ const hasPermission = (permission)=>{
        if (!(user === null || user === void 0 ? void 0 : user.role)) return false;
        const userPermissions = ROLE_PERMISSIONS[user.role] || [];
        return userPermissions.includes(permission);
    };
    /**
   * Check if current user has any of the specified permissions
   */ const hasAnyPermission = (permissions)=>{
        if (!(user === null || user === void 0 ? void 0 : user.role)) return false;
        const userPermissions = ROLE_PERMISSIONS[user.role] || [];
        return permissions.some((permission)=>userPermissions.includes(permission));
    };
    /**
   * Check if current user has all of the specified permissions
   */ const hasAllPermissions = (permissions)=>{
        if (!(user === null || user === void 0 ? void 0 : user.role)) return false;
        const userPermissions = ROLE_PERMISSIONS[user.role] || [];
        return permissions.every((permission)=>userPermissions.includes(permission));
    };
    /**
   * Check if user can access data based on role and data scope
   */ const canAccessData = (dataScope)=>{
        switch(dataScope){
            case 'own':
                return hasAnyPermission([
                    'data:view_own',
                    'data:view_department',
                    'data:view_all'
                ]);
            case 'department':
                return hasAnyPermission([
                    'data:view_department',
                    'data:view_all'
                ]);
            case 'all':
                return hasPermission('data:view_all');
            case 'public':
                return hasAnyPermission([
                    'data:view_public',
                    'data:view_own',
                    'data:view_department',
                    'data:view_all'
                ]);
            default:
                return false;
        }
    };
    /**
   * Check if user can perform action on specific module
   */ const canAccessModule = (module, action)=>{
        const permission = "".concat(module, ":").concat(action);
        return hasPermission(permission);
    };
    /**
   * Get user role display name in Vietnamese
   */ const getRoleDisplayName = (role)=>{
        const roleNames = {
            [UserRole.ADMIN]: 'Admin CNTT',
            [UserRole.USER]: 'Người dùng cơ sở',
            [UserRole.STUDENT]: 'Sinh viên/Học viên quốc tế',
            [UserRole.SPECIALIST]: 'Chuyên viên HTQT/KHCN&ĐN',
            [UserRole.MANAGER]: 'Lãnh đạo Phòng',
            [UserRole.VIEWER]: 'Người dùng tra cứu',
            [UserRole.SYSTEM]: 'Hệ thống'
        };
        return roleNames[role] || role || 'Không xác định';
    };
    /**
   * Check specific role-based actions
   */ const can = {
        // User management
        createUser: ()=>hasPermission('user:create'),
        manageUsers: ()=>hasPermission('user:read'),
        assignRoles: ()=>hasPermission('user:assign_role'),
        // System
        configureSystem: ()=>hasPermission('system:config'),
        viewSystemLogs: ()=>hasPermission('system:logs'),
        // MOU
        createMOU: ()=>hasPermission('mou:create'),
        viewMOU: ()=>hasPermission('mou:read'),
        editMOU: ()=>hasPermission('mou:update'),
        deleteMOU: ()=>hasPermission('mou:delete'),
        reviewMOU: ()=>hasPermission('mou:review'),
        approveMOU: ()=>hasPermission('mou:approve'),
        signMOU: ()=>hasPermission('mou:sign'),
        terminateMOU: ()=>hasPermission('mou:terminate'),
        exportMOU: ()=>hasPermission('mou:export'),
        // Visa
        createVisa: ()=>hasPermission('visa:create'),
        viewVisa: ()=>hasPermission('visa:read'),
        editVisa: ()=>hasPermission('visa:update'),
        deleteVisa: ()=>hasPermission('visa:delete'),
        reviewVisa: ()=>hasPermission('visa:review'),
        approveVisa: ()=>hasPermission('visa:approve'),
        rejectVisa: ()=>hasPermission('visa:reject'),
        exportVisa: ()=>hasPermission('visa:export'),
        // Translation
        createTranslation: ()=>hasPermission('translation:create'),
        viewTranslation: ()=>hasPermission('translation:read'),
        editTranslation: ()=>hasPermission('translation:update'),
        deleteTranslation: ()=>hasPermission('translation:delete'),
        reviewTranslation: ()=>hasPermission('translation:review'),
        approveTranslation: ()=>hasPermission('translation:approve'),
        certifyTranslation: ()=>hasPermission('translation:certify'),
        // Visitor
        createVisitor: ()=>hasPermission('visitor:create'),
        viewVisitor: ()=>hasPermission('visitor:read'),
        editVisitor: ()=>hasPermission('visitor:update'),
        deleteVisitor: ()=>hasPermission('visitor:delete'),
        approveVisitor: ()=>hasPermission('visitor:approve'),
        exportVisitor: ()=>hasPermission('visitor:export'),
        // Reports
        viewReports: ()=>hasPermission('report:view'),
        exportReports: ()=>hasPermission('report:export'),
        viewStatistics: ()=>hasPermission('report:stats')
    };
    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        canAccessData,
        canAccessModule,
        getRoleDisplayName,
        can,
        userRole: user === null || user === void 0 ? void 0 : user.role,
        isAdmin: (user === null || user === void 0 ? void 0 : user.role) === UserRole.ADMIN,
        isUser: (user === null || user === void 0 ? void 0 : user.role) === UserRole.USER,
        isStudent: (user === null || user === void 0 ? void 0 : user.role) === UserRole.STUDENT,
        isSpecialist: (user === null || user === void 0 ? void 0 : user.role) === UserRole.SPECIALIST,
        isManager: (user === null || user === void 0 ? void 0 : user.role) === UserRole.MANAGER,
        isViewer: (user === null || user === void 0 ? void 0 : user.role) === UserRole.VIEWER,
        isSystem: (user === null || user === void 0 ? void 0 : user.role) === UserRole.SYSTEM
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>HomePage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/usePermissions.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function HomePage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            // Check if user is authenticated
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authHelpers"].isAuthenticated()) {
                const user = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authHelpers"].getUser();
                const userRole = user === null || user === void 0 ? void 0 : user.role;
                // Redirect based on user role to their specific dashboard
                switch(userRole){
                    case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].ADMIN:
                        router.push('/dashboard'); // Admin dashboard with AdminLayout
                        break;
                    case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].USER:
                        router.push('/dashboard'); // User dashboard with UserLayout
                        break;
                    case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].STUDENT:
                        router.push('/dashboard'); // Student dashboard with StudentLayout
                        break;
                    case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].SPECIALIST:
                        router.push('/dashboard'); // Specialist dashboard with SpecialistLayout
                        break;
                    case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].MANAGER:
                        router.push('/dashboard'); // Manager dashboard with ManagerLayout
                        break;
                    case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].VIEWER:
                        router.push('/dashboard'); // Viewer dashboard with ViewerLayout
                        break;
                    default:
                        router.push('/dashboard'); // Default to dashboard
                }
            } else {
                router.push('/login');
            }
        }
    }["HomePage.useEffect"], [
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center bg-gray-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-600",
                    children: "Đang tải..."
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 47,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_s(HomePage, "vQduR7x+OPXj6PSmJyFnf+hU7bg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = HomePage;
var _c;
__turbopack_context__.k.register(_c, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_d89fb1c3._.js.map