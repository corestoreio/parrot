package api

const (
	AdminRole       = "admin"
	ContributorRole = "contributor"
	ReaderRole      = "reader"
)

func getProjectUserRole(userID, projID int) (string, error) {
	users, err := store.GetProjectUserRoles(projID)
	if err != nil {
		return "", err
	}
	for _, u := range users {
		if u.UserID == userID {
			return u.Role, nil
		}
	}
	return "", ErrNotFound
}

func isProjectUser(userID, projID int) (bool, error) {
	users, err := store.GetProjectUsers(projID)
	if err != nil {
		return false, err
	}
	for _, u := range users {
		if u.ID == userID {
			return true, nil
		}
	}
	return false, nil
}

func canAssignRoles(role string) bool {
	switch role {
	case AdminRole:
		return true
	}
	return false
}

func canRevokeRoles(role string) bool {
	switch role {
	case AdminRole:
		return true
	}
	return false
}

func canUpdateRoles(role string) bool {
	switch role {
	case AdminRole:
		return true
	}
	return false
}

func canViewProjectRoles(role string) bool {
	switch role {
	case AdminRole, ContributorRole, ReaderRole:
		return true
	}
	return false
}

func canUpdateProject(role string) bool {
	switch role {
	case AdminRole, ContributorRole:
		return true
	}
	return false
}

func canDeleteProject(role string) bool {
	switch role {
	case AdminRole:
		return true
	}
	return false
}

func canViewProject(role string) bool {
	switch role {
	case AdminRole, ContributorRole, ReaderRole:
		return true
	}
	return false
}

func canCreateLocales(role string) bool {
	switch role {
	case AdminRole, ContributorRole:
		return true
	}
	return false
}

func canUpdateLocales(role string) bool {
	switch role {
	case AdminRole, ContributorRole:
		return true
	}
	return false
}

func canDeleteLocales(role string) bool {
	switch role {
	case AdminRole:
		return true
	}
	return false
}

func canViewLocales(role string) bool {
	switch role {
	case AdminRole, ContributorRole, ReaderRole:
		return true
	}
	return false
}
