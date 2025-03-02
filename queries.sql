create table users (recid int auto_increment primary key,name varchar(1000),email varchar(500),password varchar(500),profileimage varchar(2000),gender char,bod date);
create table notes_categories (recid int auto_increment primary key, name varchar(200),sortOrder int, addedby int,addedat date,modifiedat date,endedat date);
create table notes (recid int auto_increment primary key,title varchar(500),notedata json,password varchar(50),catId int,addedby int,addedat date,modifiedat date,endedat date);
create table notes_shared (recid int auto_increment primary key, noteid int,userid int,view char,edit char,addedat date,modifiedat date,endedat date);

Alter Table notes Add Column visibility varchar(2) after password;
Alter Table notes modify Column visibility varchar(2) default 'PV';