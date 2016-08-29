import Users from 'meteor/nova:users';

/*
  Let's create a new "mods" group that can edit and delete any posts
*/

Users.createGroup("mods");

Users.groups.mods.can("posts.edit.all"); // mods can edit anybody's posts
Users.groups.mods.can("posts.remove.all"); // mods can delete anybody's posts

Users.createGroup("users");

Users.groups.users.can("posts.new"); // users can create posts
Users.groups.users.can("comments.new"); // users can create comments

// Default can't create posts or comments
Users.groups.default.cannot("posts.new");
Users.groups.default.cannot("comments.new")
