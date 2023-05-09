exports.articleMessages = getArticleRelatedResponseMessage();
exports.tagMessages = getTagRelatedResponseMessage();
exports.userMessages = getUserRelatedResponseMessage();
exports.startupMessages = getStartupResponseMessage();

function getUserRelatedResponseMessage() {
    return {
        INVALID_VERIFICATION_LINK: "Verification link is invalid.",
        VERIFICATION_LINK_VERIFIED: "User link verified.",
        RESEND_VERIFICATION: "Resend verification mail has been sent.",
        EMAIL_NOT_MATCH: "User email does not match.",
        NOT_REGISTERED: "This user not registered.",
        PASSWORD_NOT_MATCH: "User password does not match.",
        OLD_PASSWORD_NOT_MATCH: "Old password does not match.",
        USER_CREATED: "User created scucessfully.",
        USER_NOT_CREATED: "User has not been created.",
        USER_ALREADY_REGISTERED: "User already registered.",
        EMAIL_ALREADY_USED: "This email already used.",
        USERNAME_ALREADY_REGISTERED: "Username already registered.",
        FORGET_PASSWORD_LINK: "Forget password link has been sent.",
        PASSWORD_RESET: "Password reset successfully.",
        PASSWORD_UPDATED: "Password updated succesfully.",
        INVALID_USER_TYPE: "Invalid user type.",
        USER_NOT_VERIFIED: "User has not been verified.",
        SOMETHING_WRONG: "Something went wrong.",
        UNAUTHORIZED: "Unauthorize",
        NEW_USER_CREATED: "New user created successffuly.",
        USER_LOGGEDIN: "User loggedin scucessfully.",
        USER_TOKEN_REFRESH: "User token has been refreshed.",
        USER_PROFILE_UPDATED: "User profile has been updated.",
        USER_NOT_FOUND: "User not found.",
        USER_BLOCKED: "Your account is blocked by super admin.",
        USER_DELETED: "This user deleted."
    }
}
function getArticleRelatedResponseMessage() {
    return {
        ARTICLE_CREATED: "Article created and verification link has been sent.",
        ARTICLE_NOT_CREATED: "Article has not been created.",
        ARTICLE_ALREADY_REGISTERED: "Article already registered.",
        EMAIL_ALREADY_USED: "This email already used.",
        USERNAME_ALREADY_REGISTERED: "Username already registered.",
        INVALID_ARTICLE_TYPE: "Invalid Article type.",
        SOMETHING_WRONG: "Something went wrong.",
        UNAUTHORIZED: "Unauthorize",
        NEW_ARTICLE_CREATED: "New Article created successffuly.",
        ARTICLE_LOGGEDIN: "Article loggedin scucessfully.",
        ARTICLE_TOKEN_REFRESH: "Article token has been refreshed.",
        ARTICLE_UPDATED: "Article profile has been updated.",
        ARTICLE_NOT_FOUND: "Article not found.",
        ARTICLE_BLOCKED: "Your account is blocked by super admin.",
        ARTICLE_DELETED: "This Article deleted."
    }
}

function getTagRelatedResponseMessage() {
    return {
        TAGS_CREATED: "Tag created and verification link has been sent.",
        TAGS_NOT_CREATED: "Tag has not been created.",
        TAGS_ALREADY_REGISTERED: "Tag already registered.",
        USERNAME_ALREADY_REGISTERED: "Username already registered.",
        INVALID_TAGS_TYPE: "Invalid Tag type.",
        SOMETHING_WRONG: "Something went wrong.",
        NEW_TAGS_CREATED: "New Tag created successffuly.",
        TAGS_UPDATED: "Tag tag has been updated.",
        TAGS_NOT_FOUND: "Tag not found.",
        TAGS_DELETED: "This Tag deleted."
    }
}
function getStartupResponseMessage() {
    return {
        STARTUP_CREATED: "Startup created and verification link has been sent.",
        STARTUP_NOT_CREATED: "Startup has not been created.",
        STARTUP_ALREADY_REGISTERED: "Startup already registered.",
        USERNAME_ALREADY_REGISTERED: "Username already registered.",
        INVALID_STARTUP_TYPE: "Invalid Startup type.",
        SOMETHING_WRONG: "Something went wrong.",
        NEW_STARTUP_CREATED: "New Startup created successffuly.",
        STARTUP_UPDATED: "Startup Startup has been updated.",
        STARTUP_NOT_FOUND: "Startup not found.",
        STARTUP_DELETED: "This Startup deleted."
    }
}