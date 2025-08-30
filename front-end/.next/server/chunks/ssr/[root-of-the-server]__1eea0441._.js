module.exports = {

"[externals]/util [external] (util, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/assert [external] (assert, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}}),
"[externals]/tty [external] (tty, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}}),
"[externals]/os [external] (os, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[externals]/events [external] (events, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[project]/src/lib/api-client.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "authAPI": ()=>authAPI,
    "default": ()=>__TURBOPACK__default__export__,
    "translationAPI": ()=>translationAPI,
    "usersAPI": ()=>usersAPI,
    "visitorsAPI": ()=>visitorsAPI
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
;
// Create axios instance with default config
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: 'http://localhost:3001/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});
// Add request interceptor to include auth token
apiClient.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
});
// Add response interceptor to handle errors
apiClient.interceptors.response.use((response)=>response, (error)=>{
    if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
const authAPI = {
    login: async (email, password)=>{
        const response = await apiClient.post('/auth/login', {
            email,
            password
        });
        return response.data;
    },
    loginByUsername: async (username, password)=>{
        const response = await apiClient.post('/auth/login', {
            username,
            password
        });
        return response.data;
    },
    logout: async ()=>{
        const response = await apiClient.post('/auth/logout');
        return response.data;
    },
    getProfile: async ()=>{
        const response = await apiClient.get('/auth/profile');
        return response.data;
    },
    refreshToken: async ()=>{
        const response = await apiClient.post('/auth/refresh');
        return response.data;
    }
};
const usersAPI = {
    getUsers: async ()=>{
        const response = await apiClient.get('/users');
        return response.data;
    },
    getUser: async (id)=>{
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
    },
    createUser: async (userData)=>{
        const response = await apiClient.post('/users', userData);
        return response.data;
    },
    updateUser: async (id, userData)=>{
        const response = await apiClient.put(`/users/${id}`, userData);
        return response.data;
    },
    deleteUser: async (id)=>{
        const response = await apiClient.delete(`/users/${id}`);
        return response.data;
    }
};
const visitorsAPI = {
    getVisitors: async ()=>{
        const response = await apiClient.get('/visitors');
        return response.data;
    },
    getVisitor: async (id)=>{
        const response = await apiClient.get(`/visitors/${id}`);
        return response.data;
    },
    createVisitor: async (visitorData)=>{
        const response = await apiClient.post('/visitors', visitorData);
        return response.data;
    },
    updateVisitor: async (id, visitorData)=>{
        const response = await apiClient.put(`/visitors/${id}`, visitorData);
        return response.data;
    },
    deleteVisitor: async (id)=>{
        const response = await apiClient.delete(`/visitors/${id}`);
        return response.data;
    }
};
const translationAPI = {
    getTranslationRequests: async ()=>{
        const response = await apiClient.get('/translation-requests');
        return response.data;
    },
    getTranslationRequest: async (id)=>{
        const response = await apiClient.get(`/translation-requests/${id}`);
        return response.data;
    },
    createTranslationRequest: async (requestData)=>{
        const response = await apiClient.post('/translation-requests', requestData);
        return response.data;
    },
    updateTranslationRequest: async (id, requestData)=>{
        const response = await apiClient.put(`/translation-requests/${id}`, requestData);
        return response.data;
    },
    deleteTranslationRequest: async (id)=>{
        const response = await apiClient.delete(`/translation-requests/${id}`);
        return response.data;
    }
};
const __TURBOPACK__default__export__ = apiClient;
}),
"[project]/src/lib/auth.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "authHelpers": ()=>authHelpers,
    "default": ()=>__TURBOPACK__default__export__
});
const authHelpers = {
    // Token management
    setToken: (token)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    },
    getToken: ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return null;
    },
    removeToken: ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    },
    // User management
    setUser: (user)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    },
    getUser: ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return null;
    },
    removeUser: ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    },
    // Authentication checks
    isAuthenticated: ()=>{
        // Check if user is authenticated by looking for token in localStorage
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return false;
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
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
};
const __TURBOPACK__default__export__ = authHelpers;
}),
"[project]/src/hooks/usePermissions.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "UserRole": ()=>UserRole,
    "usePermissions": ()=>usePermissions
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-ssr] (ecmascript)");
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
    const user = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authHelpers"].getUser();
    /**
   * Check if current user has a specific permission
   */ const hasPermission = (permission)=>{
        if (!user?.role) return false;
        const userPermissions = ROLE_PERMISSIONS[user.role] || [];
        return userPermissions.includes(permission);
    };
    /**
   * Check if current user has any of the specified permissions
   */ const hasAnyPermission = (permissions)=>{
        if (!user?.role) return false;
        const userPermissions = ROLE_PERMISSIONS[user.role] || [];
        return permissions.some((permission)=>userPermissions.includes(permission));
    };
    /**
   * Check if current user has all of the specified permissions
   */ const hasAllPermissions = (permissions)=>{
        if (!user?.role) return false;
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
        const permission = `${module}:${action}`;
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
        userRole: user?.role,
        isAdmin: user?.role === UserRole.ADMIN,
        isUser: user?.role === UserRole.USER,
        isStudent: user?.role === UserRole.STUDENT,
        isSpecialist: user?.role === UserRole.SPECIALIST,
        isManager: user?.role === UserRole.MANAGER,
        isViewer: user?.role === UserRole.VIEWER,
        isSystem: user?.role === UserRole.SYSTEM
    };
};
}),
"[project]/src/lib/role-navigation.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "canAccessRoute": ()=>canAccessRoute,
    "getDashboardUrl": ()=>getDashboardUrl,
    "getRedirectUrl": ()=>getRedirectUrl,
    "getRoleLandingPages": ()=>getRoleLandingPages
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/usePermissions.ts [app-ssr] (ecmascript)");
;
const getDashboardUrl = (userRole)=>{
    switch(userRole){
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].ADMIN:
            return '/dashboard/admin';
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].STUDENT:
            return '/dashboard/student';
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].SPECIALIST:
            return '/dashboard/specialist';
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].MANAGER:
            return '/dashboard/manager';
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].VIEWER:
            return '/dashboard/viewer';
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].USER:
        default:
            return '/dashboard';
    }
};
const getRoleLandingPages = ()=>({
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].ADMIN]: {
            primary: '/dashboard/admin',
            secondary: '/dashboard/admin/users',
            description: 'Quản lý hệ thống'
        },
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].USER]: {
            primary: '/dashboard',
            secondary: '/dashboard/visa',
            description: 'Tạo đơn và quản lý'
        },
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].STUDENT]: {
            primary: '/dashboard/student',
            secondary: '/dashboard/visa/create',
            description: 'Gia hạn visa và thủ tục'
        },
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].SPECIALIST]: {
            primary: '/dashboard/specialist',
            secondary: '/dashboard/specialist/visa-review',
            description: 'Xét duyệt và xử lý'
        },
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].MANAGER]: {
            primary: '/dashboard/manager',
            secondary: '/dashboard/manager/visa-approval',
            description: 'Phê duyệt và ký duyệt'
        },
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].VIEWER]: {
            primary: '/dashboard/viewer',
            secondary: '/dashboard/viewer/visa-lookup',
            description: 'Tra cứu thông tin'
        },
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].SYSTEM]: {
            primary: '/dashboard',
            secondary: '/dashboard',
            description: 'Hệ thống tự động'
        }
    });
const canAccessRoute = (userRole, route)=>{
    // Admin can access everything
    if (userRole === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].ADMIN) {
        return true;
    }
    // Define role-specific route patterns
    const routePermissions = {
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].USER]: [
            '/dashboard',
            '/dashboard/visa',
            '/dashboard/mou',
            '/dashboard/translation',
            '/dashboard/visitor'
        ],
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].STUDENT]: [
            '/dashboard',
            '/dashboard/student',
            '/dashboard/visa/create',
            '/dashboard/visa/my',
            '/dashboard/student/guide',
            '/dashboard/student/appointments'
        ],
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].SPECIALIST]: [
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
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].MANAGER]: [
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
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].VIEWER]: [
            '/dashboard',
            '/dashboard/viewer',
            '/dashboard/viewer/visa-lookup',
            '/dashboard/viewer/mou-lookup',
            '/dashboard/viewer/visitor-lookup',
            '/dashboard/viewer/public-stats'
        ],
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].SYSTEM]: [
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
}),
"[project]/src/app/login/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>LoginPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/usePermissions.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$role$2d$navigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/role-navigation.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function LoginPage() {
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            // Call real API
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authAPI"].login(email, password);
            if (response.access_token && response.user) {
                // Store token and user info
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authHelpers"].setToken(response.access_token);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authHelpers"].setUser(response.user);
                // Get user role from response
                const userRole = response.user.role || response.user.roles?.[0]?.name || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].USER;
                // Redirect to appropriate dashboard based on role
                const dashboardUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$role$2d$navigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDashboardUrl"])(userRole);
                console.log(`Redirecting ${userRole} to: ${dashboardUrl}`);
                router.push(dashboardUrl);
            } else {
                setError('Phản hồi từ server không hợp lệ');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response?.status === 401) {
                setError('Email hoặc mật khẩu không đúng');
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
                setError('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.');
            } else {
                setError('Đăng nhập thất bại. Vui lòng thử lại.');
            }
        } finally{
            setIsLoading(false);
        }
    };
    const handleClearData = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authHelpers"].removeToken();
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authHelpers"].removeUser();
        localStorage.clear();
        setError('');
        alert('Đã xóa dữ liệu cache. Vui lòng thử đăng nhập lại.');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-md w-full space-y-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "mt-6 text-center text-3xl font-extrabold text-gray-900",
                            children: "Đăng nhập hệ thống"
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-center text-sm text-gray-600",
                            children: "PBL6 - Hệ thống Quản lý Hợp tác Quốc tế"
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 p-4 bg-blue-50 rounded-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-medium text-blue-800 mb-2",
                                    children: "Thông tin đăng nhập:"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 77,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-blue-700 space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                "• ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Email:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.tsx",
                                                    lineNumber: 79,
                                                    columnNumber: 20
                                                }, this),
                                                " admin@htqt.edu.vn"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 79,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                "• ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Mật khẩu:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.tsx",
                                                    lineNumber: 80,
                                                    columnNumber: 20
                                                }, this),
                                                " 123456"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 80,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 text-red-600",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Lưu ý:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.tsx",
                                                    lineNumber: 82,
                                                    columnNumber: 17
                                                }, this),
                                                " Backend phải chạy trên localhost:3001"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 81,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 78,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    className: "mt-8 space-y-6",
                    onSubmit: handleSubmit,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-md shadow-sm -space-y-px",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "email",
                                            className: "sr-only",
                                            children: "Email"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 90,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                            lineNumber: 93,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 89,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "password",
                                            className: "sr-only",
                                            children: "Mật khẩu"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 106,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                            lineNumber: 109,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-red-600 text-sm text-center",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 124,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: isLoading,
                                className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed",
                                children: isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'
                            }, void 0, false, {
                                fileName: "[project]/src/app/login/page.tsx",
                                lineNumber: 130,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 129,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleClearData,
                                className: "text-sm text-gray-500 hover:text-gray-700 underline",
                                children: "Xóa dữ liệu cache (nếu gặp lỗi)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/login/page.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 140,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 87,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 68,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/login/page.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__1eea0441._.js.map