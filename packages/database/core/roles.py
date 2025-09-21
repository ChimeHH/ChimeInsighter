import collections

class Permissions:
    PERMISSIONS = []

class Role:
    def __init__(self, permissions):
        self.permissions = permissions

    def __str__(self):
        return "{}({})".format(self.__class__.__name__, self.permissions)
    def __repr__(self):
        return self.__str__()

class Roles:
    ROLES_PERMISSIONS = {}

    @classmethod
    def role_valid(cls, role):
        pass

    @classmethod
    def roles(cls):
        return list(cls.ROLES_PERMISSIONS.keys())

    @classmethod
    def get_role_permissions(cls, role):
        return cls.ROLES_PERMISSIONS.get(role, Role([])).permissions
        

    @classmethod
    def get_permission_roles(cls, permission):
        return cls.permission_to_roles().get(permission, [])

    @classmethod
    def permission_to_roles(cls):
        permission_relevant_roles = collections.defaultdict(list)
        for role, role_obejct in cls.ROLES_PERMISSIONS.items():
            for permission in role_obejct.permissions:
                permission_relevant_roles[permission].append(role)
        return permission_relevant_roles

class SystemPermissions(Permissions):
    SYSADMINS = 'sysadmins'

    MANAGE_ALL_GROUPS = 'manage_all_groups'
    MANAGE_ALL_PROJECTS = 'manage_all_projects'
    
    MANAGE_USERS = 'manage_users'    
    MANAGE_GROUPS = 'manage_groups'
    MANAGE_PROJECTS = 'manage_projects'
    MANAGE_MODELS = 'manage_models'
    
    VIEW_MODELS = 'view_models'
    VIEW_RESULTS = 'view_results'

    PERMISSIONS = [SYSADMINS, 
                   MANAGE_ALL_GROUPS, MANAGE_ALL_PROJECTS, 
                   MANAGE_USERS, MANAGE_GROUPS, MANAGE_PROJECTS, MANAGE_MODELS, 
                   VIEW_MODELS, VIEW_RESULTS]

class ProjectPermissions(Permissions):
    MANAGE = 'manage'
    UPDATE = 'update'
    VIEW = 'view'

    PERMISSIONS = [MANAGE, VIEW, UPDATE]

class SystemRole(Role):
    pass

class ProjectRole(Role):
    pass
    
class ProjectRoles(Roles):
    ADMIN = 'admin'
    MEMBER = 'member'
    VIEWER = 'viewer'

    ROLES_PERMISSIONS = {
        ADMIN: ProjectRole(ProjectPermissions.PERMISSIONS),
        MEMBER: ProjectRole([ProjectPermissions.UPDATE, ProjectPermissions.VIEW]),
        VIEWER: ProjectRole([ProjectPermissions.VIEW]),
    }
    @classmethod
    def role_valid(cls, role):
        return role in (cls.ADMIN, cls.MEMBER, cls.VIEWER)

    
class SystemRoles(Roles):
    ADMIN = 'admin'
    MANAGER = 'manager'
    MEMBER = 'member'

    ROLES_PERMISSIONS = {
        ADMIN: SystemRole([SystemPermissions.SYSADMINS,
                              SystemPermissions.MANAGE_ALL_GROUPS, 
                              SystemPermissions.MANAGE_ALL_PROJECTS,
                              SystemPermissions.MANAGE_USERS, 
                              SystemPermissions.MANAGE_GROUPS, 
                              SystemPermissions.MANAGE_PROJECTS, 
                              SystemPermissions.MANAGE_MODELS, 
                              SystemPermissions.VIEW_MODELS, 
                              SystemPermissions.VIEW_RESULTS]),
        MANAGER:  SystemRole([SystemPermissions.MANAGE_GROUPS, 
                              SystemPermissions.MANAGE_PROJECTS, 
                              SystemPermissions.VIEW_MODELS, 
                              SystemPermissions.VIEW_RESULTS]),
        MEMBER:   SystemRole([SystemPermissions.VIEW_MODELS, 
                              SystemPermissions.VIEW_RESULTS])
    }

    ADMIN_ROLES = { ADMIN : [ADMIN, MANAGER, MEMBER],
                    MANAGER : [MANAGER, MEMBER],
                    MEMBER : [MEMBER]}

    @classmethod
    def role_valid(cls, role):
        return role in (cls.ADMIN, cls.MANAGER, cls.MEMBER)

    @classmethod
    def is_admin(cls, role):
        return True if role == cls.ADMIN else False

    @classmethod
    def can_admin_role(cls, role, new_role):
        return new_role in cls.ADMIN_ROLES[role]

    
if __name__ == "__main__":
    from pprint import pp
    print("project roles:")
    pp(ProjectRoles.roles())

    print("project permissions to roles:")
    pp(ProjectRoles._permission_to_roles())

    print("{} -> {}".format('manage', ProjectRoles.get_permission_roles('manage')))
    print("{} -> {}".format('update', ProjectRoles.get_permission_roles('update')))
    print("{} -> {}".format('view', ProjectRoles.get_permission_roles('view')))

    print("system roles:")
    pp(SystemRoles.roles())

    print("system admin roles:")
    pp(SystemRoles.ADMIN_ROLES)

    print("system permissions to roles:")
    pp(SystemRoles._permission_to_roles())

    print("{} -> {}".format('sysadmins', SystemRoles.get_permission_roles('sysadmins')))
    print("{} -> {}".format('manage_users', SystemRoles.get_permission_roles('manage_users')))
    print("{} -> {}".format('view_results', SystemRoles.get_permission_roles('view_results')))

