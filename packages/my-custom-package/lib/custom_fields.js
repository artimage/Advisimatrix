import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import Categories from 'meteor/nova:categories';

/*
Let's assign a color to each post (why? cause we want to, that's why).
We'll do that by adding a custom field to the Posts collection.
Note that this requires our custom package to depend on nova:posts and nova:users.
*/

// check if user can create a new post
const canInsert = user => Users.canDo(user, "posts.new");
// check if user can edit a post
const canEdit = Users.canEdit;

// Categories but not companies
Posts.addField(
  {
    fieldName: 'categories',
    fieldSchema: {
      type: [String],
      control: "checkboxgroup",
      optional: true,
      insertableIf: canInsert,
      editableIf: canEdit,
      autoform: {
        noselect: true,
        type: "bootstrap-category",
        order: 50,
        options: function () {
          // We want to hide companies from the category list.
          var categories = Categories.find({ $nor: [{ parentId: { $eq: 'companies' } }, { name: { $eq: 'Companies' } }] }).map(function (category) {
            return {
              value: category._id,
              label: category.name
            };
          });
          return categories;
        }
      },
      publish: true,
      join: {
        joinAs: "categoriesArray",
        collection: () => Categories
      }
    }
  }
);

PublicationUtils.addToFields(Posts.publishedFields.list, ["categories"]);

Posts.addField(
  {
    fieldName: 'companies',
    fieldSchema: {
      type: [String],
      control: "checkboxgroup", // XXX make this a select
      optional: true,
      insertableIf: canInsert,
      editableIf: canEdit,
      autoform: {
        noselect: true,
        type: "bootstrap-category",
        order: 50,
        options: function () {
          // XXX Still need to limit to companies you ahve access to
          var companies = Categories.find( { parentId: { $eq: 'companies' } } ).map(function (category) {
            return {
              value: category._id,
              label: category.name
            };
          });
          return companies;
        }
      },
      publish: true//,
      //join: {
      //  joinAs: "companiesArray",
      //  collection: () => Categories
      //}
    }
  }
);

PublicationUtils.addToFields(Posts.publishedFields.list, ["companies"]);

// XXX We should remove this and the other colorization part or use it to color posts by type
Posts.addField(
  {
    fieldName: 'color',
    fieldSchema: {
      type: String,
      control: "select", // use a select form control
      optional: true, // this field is not required
      insertableIf: canInsert, // XXX This is wrong.
      editableIf: canEdit, // XXX This is wrong.
      autoform: {
        options: function () { // options for the select form control
          return [
            {value: "white", label: "White"},
            {value: "yellow", label: "Yellow"},
            {value: "blue", label: "Blue"},
            {value: "red", label: "Red"},
            {value: "green", label: "Green"}
          ];
        }
      },
      publish: true // make that field public and send it to the client
    }
  }
);

/*
We  add a custom field for difficutly. This will be used in scoring later.

*/
Posts.addField(
  {
    fieldName: 'difficulty',
    fieldSchema: {
      type: String,
      control: "select", // use a select form control
      optional: true, // this field is not required
      insertableIf: canInsert,
      editableIf: canEdit,
      autoform: {
        options: function () { // options for the select form control
          return [
            {value: "small", label: "Small"},
            {value: "medium", label: "Medium"},
            {value: "large", label: "Large"}
          ];
        }
      },
      publish: false // hiding this field now
    }
  }
);

/*
The main post list view uses a special object to determine which fields to publish,
so we also add our new field to that object:
*/

import PublicationUtils from 'meteor/utilities:smart-publications';

PublicationUtils.addToFields(Posts.publishedFields.list, ["color"]);
PublicationUtils.addToFields(Posts.publishedFields.list, ["difficulty"]);

/*
We need to have certian groups that people belong to. They will only be able to see posts that have no
category or a category they are a member of.
*/

// check if user is an admin
const isAdmin = user => Users.isAdmin(user);

Users.addField(
  {
    fieldName: 'companies',
    fieldSchema: { // see nova-users/lib/schema.js for example
      type: [String],
      optional: true,
      insertableIf: isAdmin,
      editableIf: isAdmin,
      control: "checkboxgroup",
      autoform: {
        options: function () {
          // Taken from nova-categories/lib/custom_fields.js
          var companies = Categories.find({ parentId: { $eq: 'companies' } }).map(function (category) {
            return {
              value: category._id,
              label: category.name
            };
          });
          return companies;
        }
      },
      publish: true // XXX publish this while testing. Make false after.
    }
  }
);

PublicationUtils.addToFields(Users.publishedFields.public, ["companies"]);
