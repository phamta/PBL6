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
"[project]/src/lib/role-navigation.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "canAccessRoute": ()=>canAccessRoute,
    "getDashboardUrl": ()=>getDashboardUrl,
    "getRedirectUrl": ()=>getRedirectUrl,
    "getRoleLandingPages": ()=>getRoleLandingPages
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/usePermissions.ts [app-client] (ecmascript)");
;
const getDashboardUrl = (userRole)=>{
    switch(userRole){
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].ADMIN:
            return '/dashboard/admin';
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].STUDENT:
            return '/dashboard/student';
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].SPECIALIST:
            return '/dashboard/specialist';
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].MANAGER:
            return '/dashboard/manager';
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].VIEWER:
            return '/dashboard/viewer';
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].USER:
        default:
            return '/dashboard';
    }
};
const getRoleLandingPages = ()=>({
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].ADMIN]: {
            primary: '/dashboard/admin',
            secondary: '/dashboard/admin/users',
            description: 'Quản lý hệ thống'
        },
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].USER]: {
            primary: '/dashboard',
            secondary: '/dashboard/visa',
            description: 'Tạo đơn và quản lý'
        },
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].STUDENT]: {
            primary: '/dashboard/student',
            secondary: '/dashboard/visa/create',
            description: 'Gia hạn visa và thủ tục'
        },
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].SPECIALIST]: {
            primary: '/dashboard/specialist',
            secondary: '/dashboard/specialist/visa-review',
            description: 'Xét duyệt và xử lý'
        },
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].MANAGER]: {
            primary: '/dashboard/manager',
            secondary: '/dashboard/manager/visa-approval',
            description: 'Phê duyệt và ký duyệt'
        },
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].VIEWER]: {
            primary: '/dashboard/viewer',
            secondary: '/dashboard/viewer/visa-lookup',
            description: 'Tra cứu thông tin'
        },
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].SYSTEM]: {
            primary: '/dashboard',
            secondary: '/dashboard',
            description: 'Hệ thống tự động'
        }
    });
const canAccessRoute = (userRole, route)=>{
    // Admin can access everything
    if (userRole === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].ADMIN) {
        return true;
    }
    // Define role-specific route patterns
    const routePermissions = {
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].USER]: [
            '/dashboard',
            '/dashboard/visa',
            '/dashboard/mou',
            '/dashboard/translation',
            '/dashboard/visitor'
        ],
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].STUDENT]: [
            '/dashboard',
            '/dashboard/student',
            '/dashboard/visa/create',
            '/dashboard/visa/my',
            '/dashboard/student/guide',
            '/dashboard/student/appointments'
        ],
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].SPECIALIST]: [
            '/dashboard',
            '/dashboard/specialist',
            '/dashboard/specialist/visa-review',
            '/dashboard/specialist/mou-review',
            '/dashboard/specialist/translation',
            '/dashboard/specialist/reports',
            '/dashboard/visa',
            '/dashboard/mou',
            '/dashboard/translation',
            '/dashboard/visitor'
        ],
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].MANAGER]: [
            '/dashboard',
            '/dashboard/manager',
            '/dashboard/manager/visa-approval',
            '/dashboard/manager/mou-signing',
            '/dashboard/manager/visitor-approval',
            '/dashboard/manager/statistics',
            '/dashboard/manager/export',
            '/dashboard/visa',
            '/dashboard/mou',
            '/dashboard/translation',
            '/dashboard/visitor'
        ],
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].ADMIN]: [
            '/dashboard',
            '/dashboard/admin',
            '/dashboard/admin/users',
            '/dashboard/admin/mou',
            '/dashboard/admin/system-logs',
            '/dashboard/admin/visa-extensions',
            '/dashboard/admin/international-guests',
            '/dashboard/admin/translation-certificates',
            '/dashboard/visa',
            '/dashboard/mou',
            '/dashboard/translation',
            '/dashboard/visitor'
        ],
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].VIEWER]: [
            '/dashboard',
            '/dashboard/viewer',
            '/dashboard/viewer/visa-lookup',
            '/dashboard/viewer/mou-lookup',
            '/dashboard/viewer/visitor-lookup',
            '/dashboard/viewer/public-stats'
        ],
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].SYSTEM]: [
            '/dashboard'
        ]
    };
    const allowedRoutes = routePermissions[userRole] || [];
    // Check if the route starts with any allowed pattern
    return allowedRoutes.some((allowedRoute)=>route === allowedRoute || route.startsWith(allowedRoute + '/'));
};
const getRedirectUrl = (userRole, attemptedRoute)=>{
    if (canAccessRoute(userRole, attemptedRoute)) {
        return attemptedRoute;
    }
    // If user can't access the route, redirect to their default dashboard
    return getDashboardUrl(userRole);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/login/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>LoginPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/usePermissions.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$role$2d$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/role-navigation.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function LoginPage() {
    _s();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            // Call real API using authHelpers
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authHelpers"].login({
                email,
                password
            });
            if (response.success && response.data) {
                // Get user role from response
                const userRole = response.data.user.role || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserRole"].USER;
                // Redirect to appropriate dashboard based on role
                const dashboardUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$role$2d$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDashboardUrl"])(userRole);
                console.log("Redirecting ".concat(userRole, " to: ").concat(dashboardUrl));
                router.push(dashboardUrl);
            } else {
                setError(response.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            var _error_response, _error_response_data, _error_response1;
            console.error('Login error:', error);
            if (((_error_response = error.response) === null || _error_response === void 0 ? void 0 : _error_response.status) === 401) {
                setError('Email hoặc mật khẩu không đúng');
            } else if ((_error_response1 = error.response) === null || _error_response1 === void 0 ? void 0 : (_error_response_data = _error_response1.data) === null || _error_response_data === void 0 ? void 0 : _error_response_data.message) {
                setError(error.response.data.message);
            } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
                setError('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.');
            } else if (error.message) {
                setError(error.message);
            } else {
                setError('Đăng nhập thất bại. Vui lòng thử lại.');
            }
        } finally{
            setIsLoading(false);
        }
    };
    const handleClearData = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authHelpers"].removeToken();
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authHelpers"].removeUser();
        localStorage.clear();
        setError('');
        alert('Đã xóa dữ liệu cache. Vui lòng thử đăng nhập lại.');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-md w-full space-y-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "mt-6 text-center text-3xl font-extrabold text-gray-900",
                            children: "Đăng nhập hệ thống"
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-center text-sm text-gray-600",
                            children: "PBL6 - Hệ thống Quản lý Hợp tác Quốc tế"
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 p-4 bg-blue-50 rounded-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-medium text-blue-800 mb-2",
                                    children: "Thông tin đăng nhập:"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 74,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-blue-700 space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                "• ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Email:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.tsx",
                                                    lineNumber: 76,
                                                    columnNumber: 20
                                                }, this),
                                                " admin@htqt.edu.vn"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 76,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                "• ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Mật khẩu:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.tsx",
                                                    lineNumber: 77,
                                                    columnNumber: 20
                                                }, this),
                                                " 123456"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 77,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 text-red-600",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Lưu ý:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.tsx",
                                                    lineNumber: 79,
                                                    columnNumber: 17
                                                }, this),
                                                " Backend phải chạy trên localhost:3001"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 78,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 75,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    className: "mt-8 space-y-6",
                    onSubmit: handleSubmit,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-md shadow-sm -space-y-px",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "email",
                                            className: "sr-only",
                                            children: "Email"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 87,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "email",
                                            name: "email",
                                            type: "email",
                                            autoComplete: "email",
                                            required: true,
                                            className: "relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm",
                                            placeholder: "Địa chỉ email",
                                            value: email,
                                            onChange: (e)=>setEmail(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 90,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 86,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "password",
                                            className: "sr-only",
                                            children: "Mật khẩu"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 103,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "password",
                                            name: "password",
                                            type: "password",
                                            autoComplete: "current-password",
                                            required: true,
                                            className: "relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm",
                                            placeholder: "Mật khẩu",
                                            value: password,
                                            onChange: (e)=>setPassword(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 106,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 102,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-red-600 text-sm text-center",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 121,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: isLoading,
                                className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed",
                                children: isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'
                            }, void 0, false, {
                                fileName: "[project]/src/app/login/page.tsx",
                                lineNumber: 127,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 126,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 65,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/login/page.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
_s(LoginPage, "fuxFTlOjwyD3LvAbyyOwPovlqfA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LoginPage;
var _c;
__turbopack_context__.k.register(_c, "LoginPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_6282d630._.js.map