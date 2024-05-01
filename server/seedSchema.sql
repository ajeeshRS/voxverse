
-- CREATE TABLE IF NOT EXISTS blog_drafts (
--     user_id character varying(255) NOT NULL,
--     id SERIAL PRIMARY KEY,
--     title character varying(255) NOT NULL,
--     content text NOT NULL,
--     tags text[] DEFAULT '{}'::text[],
--     image_filename character varying(255),
--     image_path character varying(255),
--     image_destination character varying(255),
--     draft boolean DEFAULT true,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS blogs (
--     id SERIAL PRIMARY KEY,
--     user_id character varying(255) NOT NULL,
--     title character varying(255) NOT NULL,cd
--     content character varying(100000) NOT NULL,
--     tags text[] DEFAULT '{}'::text[],
--     image_filename character varying(255),
--     image_path character varying(255),
--     image_destination character varying(255),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     email character varying(255)
-- );

-- CREATE TABLE IF NOT EXISTS bookmark (
--     bookmarkid SERIAL PRIMARY KEY,
--     userid character varying(255),
--     blogid integer
-- );

-- CREATE TABLE IF NOT EXISTS otps (
--     id SERIAL PRIMARY KEY,
--     email character varying(255) NOT NULL,
--     otp character varying(5) NOT NULL,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     expires_at timestamp without time zone
-- );

-- CREATE TABLE IF NOT EXISTS users (
--     id SERIAL PRIMARY KEY,
--     google_id character varying(255),
--     username character varying(255),
--     email character varying(255),
--     password character varying(255),
--     bio character varying(255),
--     avatar character varying(255)
-- );

-- DROP TABLE users
-- DROP TABLE blogs
-- DROP TABLE blog_drafts
-- DROP TABLE otps
-- DROP TABLE bookmark





