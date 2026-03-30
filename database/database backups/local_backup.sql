--
-- PostgreSQL database dump
--

\restrict tKt9OyP1bBDHX7lDRQcrcWD3JSTMIEOi6UIUM8f9FhM6eMB1juhAY3yfRB2NLC0

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.units DROP CONSTRAINT IF EXISTS units_society_apartment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.units DROP CONSTRAINT IF EXISTS units_floor_id_fkey;
ALTER TABLE IF EXISTS ONLY public.units DROP CONSTRAINT IF EXISTS units_block_id_fkey;
ALTER TABLE IF EXISTS ONLY public.union_members DROP CONSTRAINT IF EXISTS union_members_unit_id_fkey;
ALTER TABLE IF EXISTS ONLY public.union_members DROP CONSTRAINT IF EXISTS union_members_society_apartment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.union_members DROP CONSTRAINT IF EXISTS union_members_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.super_admin_invoices DROP CONSTRAINT IF EXISTS super_admin_invoices_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.super_admin_invoices DROP CONSTRAINT IF EXISTS super_admin_invoices_subscription_id_fkey;
ALTER TABLE IF EXISTS ONLY public.super_admin_invoices DROP CONSTRAINT IF EXISTS super_admin_invoices_society_apartment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_society_apartment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_id_fkey;
ALTER TABLE IF EXISTS ONLY public.settings DROP CONSTRAINT IF EXISTS settings_society_apartment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.push_subscriptions DROP CONSTRAINT IF EXISTS push_subscriptions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.payment_history DROP CONSTRAINT IF EXISTS payment_history_updated_by_fkey;
ALTER TABLE IF EXISTS ONLY public.payment_history DROP CONSTRAINT IF EXISTS payment_history_maintenance_id_fkey;
ALTER TABLE IF EXISTS ONLY public.messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE IF EXISTS ONLY public.messages DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey;
ALTER TABLE IF EXISTS ONLY public.maintenance DROP CONSTRAINT IF EXISTS maintenance_unit_id_fkey;
ALTER TABLE IF EXISTS ONLY public.maintenance DROP CONSTRAINT IF EXISTS maintenance_society_apartment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.maintenance_config DROP CONSTRAINT IF EXISTS maintenance_config_unit_id_fkey;
ALTER TABLE IF EXISTS ONLY public.maintenance_config DROP CONSTRAINT IF EXISTS maintenance_config_society_apartment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.maintenance_config DROP CONSTRAINT IF EXISTS maintenance_config_block_id_fkey;
ALTER TABLE IF EXISTS ONLY public.floors DROP CONSTRAINT IF EXISTS floors_block_id_fkey;
ALTER TABLE IF EXISTS ONLY public.finance DROP CONSTRAINT IF EXISTS finance_society_apartment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.finance DROP CONSTRAINT IF EXISTS finance_added_by_fkey;
ALTER TABLE IF EXISTS ONLY public.family_members DROP CONSTRAINT IF EXISTS family_members_resident_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employees DROP CONSTRAINT IF EXISTS employees_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employees DROP CONSTRAINT IF EXISTS employees_society_apartment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employees DROP CONSTRAINT IF EXISTS employees_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.defaulters DROP CONSTRAINT IF EXISTS defaulters_unit_id_fkey;
ALTER TABLE IF EXISTS ONLY public.defaulters DROP CONSTRAINT IF EXISTS defaulters_society_apartment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.defaulters DROP CONSTRAINT IF EXISTS defaulters_maintenance_id_fkey;
ALTER TABLE IF EXISTS ONLY public.complaints DROP CONSTRAINT IF EXISTS complaints_unit_id_fkey;
ALTER TABLE IF EXISTS ONLY public.complaints DROP CONSTRAINT IF EXISTS complaints_submitted_by_fkey;
ALTER TABLE IF EXISTS ONLY public.complaints DROP CONSTRAINT IF EXISTS complaints_society_apartment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.complaints DROP CONSTRAINT IF EXISTS complaints_assigned_to_fkey;
ALTER TABLE IF EXISTS ONLY public.complaint_progress DROP CONSTRAINT IF EXISTS complaint_progress_updated_by_fkey;
ALTER TABLE IF EXISTS ONLY public.complaint_progress DROP CONSTRAINT IF EXISTS complaint_progress_complaint_id_fkey;
ALTER TABLE IF EXISTS ONLY public.blocks DROP CONSTRAINT IF EXISTS blocks_society_apartment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.announcements DROP CONSTRAINT IF EXISTS announcements_society_apartment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.announcements DROP CONSTRAINT IF EXISTS announcements_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.announcements DROP CONSTRAINT IF EXISTS announcements_block_id_fkey;
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_units_updated_at ON public.units;
DROP TRIGGER IF EXISTS update_super_admin_invoices_updated_at ON public.super_admin_invoices;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON public.subscription_plans;
DROP TRIGGER IF EXISTS update_settings_updated_at ON public.settings;
DROP TRIGGER IF EXISTS update_maintenance_updated_at ON public.maintenance;
DROP TRIGGER IF EXISTS update_maintenance_config_updated_at ON public.maintenance_config;
DROP TRIGGER IF EXISTS update_finance_updated_at ON public.finance;
DROP TRIGGER IF EXISTS update_defaulters_updated_at ON public.defaulters;
DROP TRIGGER IF EXISTS update_complaints_updated_at ON public.complaints;
DROP TRIGGER IF EXISTS update_complaint_progress_updated_at ON public.complaint_progress;
DROP TRIGGER IF EXISTS update_blocks_updated_at ON public.blocks;
DROP TRIGGER IF EXISTS update_apartments_updated_at ON public.apartments;
DROP TRIGGER IF EXISTS update_announcements_updated_at ON public.announcements;
DROP INDEX IF EXISTS public.idx_users_society;
DROP INDEX IF EXISTS public.idx_users_role;
DROP INDEX IF EXISTS public.idx_users_email;
DROP INDEX IF EXISTS public.idx_users_created_by;
DROP INDEX IF EXISTS public.idx_units_telephone_bills;
DROP INDEX IF EXISTS public.idx_units_other_bills;
DROP INDEX IF EXISTS public.idx_units_is_occupied;
DROP INDEX IF EXISTS public.idx_union_members_unit_id;
DROP INDEX IF EXISTS public.idx_union_members_society_apartment_id;
DROP INDEX IF EXISTS public.idx_union_members_created_by;
DROP INDEX IF EXISTS public.idx_super_admin_invoices_user;
DROP INDEX IF EXISTS public.idx_super_admin_invoices_status;
DROP INDEX IF EXISTS public.idx_super_admin_invoices_society;
DROP INDEX IF EXISTS public.idx_super_admin_invoices_due_date;
DROP INDEX IF EXISTS public.idx_subscriptions_user;
DROP INDEX IF EXISTS public.idx_subscriptions_status;
DROP INDEX IF EXISTS public.idx_subscriptions_society;
DROP INDEX IF EXISTS public.idx_subscriptions_next_billing;
DROP INDEX IF EXISTS public.idx_push_subscriptions_user;
DROP INDEX IF EXISTS public.idx_payment_history_updated_by;
DROP INDEX IF EXISTS public.idx_payment_history_maintenance;
DROP INDEX IF EXISTS public.idx_payment_history_created_at;
DROP INDEX IF EXISTS public.idx_one_union_admin_per_society;
DROP INDEX IF EXISTS public.idx_monthly_dues_log_unique;
DROP INDEX IF EXISTS public.idx_monthly_dues_log_date;
DROP INDEX IF EXISTS public.idx_messages_sender;
DROP INDEX IF EXISTS public.idx_messages_receiver;
DROP INDEX IF EXISTS public.idx_messages_created;
DROP INDEX IF EXISTS public.idx_maintenance_year_month;
DROP INDEX IF EXISTS public.idx_maintenance_unit;
DROP INDEX IF EXISTS public.idx_maintenance_society;
DROP INDEX IF EXISTS public.idx_maintenance_payment_date;
DROP INDEX IF EXISTS public.idx_maintenance_config_unit;
DROP INDEX IF EXISTS public.idx_maintenance_config_unique_unit;
DROP INDEX IF EXISTS public.idx_maintenance_config_unique_society;
DROP INDEX IF EXISTS public.idx_maintenance_config_unique_block;
DROP INDEX IF EXISTS public.idx_maintenance_config_block;
DROP INDEX IF EXISTS public.idx_finance_type;
DROP INDEX IF EXISTS public.idx_finance_society;
DROP INDEX IF EXISTS public.idx_finance_date;
DROP INDEX IF EXISTS public.idx_family_members_resident;
DROP INDEX IF EXISTS public.idx_employees_user_id;
DROP INDEX IF EXISTS public.idx_employees_society_apartment_id;
DROP INDEX IF EXISTS public.idx_employees_created_by;
DROP INDEX IF EXISTS public.idx_defaulters_unit;
DROP INDEX IF EXISTS public.idx_defaulters_society;
DROP INDEX IF EXISTS public.idx_complaints_status;
DROP INDEX IF EXISTS public.idx_complaints_society;
DROP INDEX IF EXISTS public.idx_complaints_assigned;
DROP INDEX IF EXISTS public.idx_complaint_progress_updated_by;
DROP INDEX IF EXISTS public.idx_complaint_progress_created_at;
DROP INDEX IF EXISTS public.idx_complaint_progress_complaint_id;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.units DROP CONSTRAINT IF EXISTS units_pkey;
ALTER TABLE IF EXISTS ONLY public.union_members DROP CONSTRAINT IF EXISTS union_members_pkey;
ALTER TABLE IF EXISTS ONLY public.super_admin_invoices DROP CONSTRAINT IF EXISTS super_admin_invoices_pkey;
ALTER TABLE IF EXISTS ONLY public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_key;
ALTER TABLE IF EXISTS ONLY public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_society_apartment_id_key;
ALTER TABLE IF EXISTS ONLY public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_pkey;
ALTER TABLE IF EXISTS ONLY public.subscription_plans DROP CONSTRAINT IF EXISTS subscription_plans_pkey;
ALTER TABLE IF EXISTS ONLY public.apartments DROP CONSTRAINT IF EXISTS societies_pkey;
ALTER TABLE IF EXISTS ONLY public.settings DROP CONSTRAINT IF EXISTS settings_pkey;
ALTER TABLE IF EXISTS ONLY public.push_subscriptions DROP CONSTRAINT IF EXISTS push_subscriptions_user_id_endpoint_key;
ALTER TABLE IF EXISTS ONLY public.push_subscriptions DROP CONSTRAINT IF EXISTS push_subscriptions_pkey;
ALTER TABLE IF EXISTS ONLY public.payment_history DROP CONSTRAINT IF EXISTS payment_history_pkey;
ALTER TABLE IF EXISTS ONLY public.monthly_dues_generation_log DROP CONSTRAINT IF EXISTS monthly_dues_generation_log_pkey;
ALTER TABLE IF EXISTS ONLY public.messages DROP CONSTRAINT IF EXISTS messages_pkey;
ALTER TABLE IF EXISTS ONLY public.maintenance DROP CONSTRAINT IF EXISTS maintenance_pkey;
ALTER TABLE IF EXISTS ONLY public.maintenance_config DROP CONSTRAINT IF EXISTS maintenance_config_pkey;
ALTER TABLE IF EXISTS ONLY public.floors DROP CONSTRAINT IF EXISTS floors_pkey;
ALTER TABLE IF EXISTS ONLY public.finance DROP CONSTRAINT IF EXISTS finance_pkey;
ALTER TABLE IF EXISTS ONLY public.family_members DROP CONSTRAINT IF EXISTS family_members_pkey;
ALTER TABLE IF EXISTS ONLY public.employees DROP CONSTRAINT IF EXISTS employees_user_id_key;
ALTER TABLE IF EXISTS ONLY public.employees DROP CONSTRAINT IF EXISTS employees_pkey;
ALTER TABLE IF EXISTS ONLY public.defaulters DROP CONSTRAINT IF EXISTS defaulters_pkey;
ALTER TABLE IF EXISTS ONLY public.complaints DROP CONSTRAINT IF EXISTS complaints_pkey;
ALTER TABLE IF EXISTS ONLY public.complaint_progress DROP CONSTRAINT IF EXISTS complaint_progress_pkey;
ALTER TABLE IF EXISTS ONLY public.blocks DROP CONSTRAINT IF EXISTS blocks_pkey;
ALTER TABLE IF EXISTS ONLY public.announcements DROP CONSTRAINT IF EXISTS announcements_pkey;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.units ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.union_members ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.super_admin_invoices ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.subscriptions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.subscription_plans ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.settings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.push_subscriptions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payment_history ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.monthly_dues_generation_log ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.messages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.maintenance_config ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.maintenance ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.floors ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.finance ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.family_members ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.employees ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.defaulters ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.complaints ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.complaint_progress ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.blocks ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.apartments ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.announcements ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.units_id_seq;
DROP TABLE IF EXISTS public.units;
DROP SEQUENCE IF EXISTS public.union_members_id_seq;
DROP TABLE IF EXISTS public.union_members;
DROP SEQUENCE IF EXISTS public.super_admin_invoices_id_seq;
DROP TABLE IF EXISTS public.super_admin_invoices;
DROP SEQUENCE IF EXISTS public.subscriptions_id_seq;
DROP TABLE IF EXISTS public.subscriptions;
DROP SEQUENCE IF EXISTS public.subscription_plans_id_seq;
DROP TABLE IF EXISTS public.subscription_plans;
DROP SEQUENCE IF EXISTS public.societies_id_seq;
DROP SEQUENCE IF EXISTS public.settings_id_seq;
DROP TABLE IF EXISTS public.settings;
DROP SEQUENCE IF EXISTS public.push_subscriptions_id_seq;
DROP TABLE IF EXISTS public.push_subscriptions;
DROP SEQUENCE IF EXISTS public.payment_history_id_seq;
DROP TABLE IF EXISTS public.payment_history;
DROP SEQUENCE IF EXISTS public.monthly_dues_generation_log_id_seq;
DROP TABLE IF EXISTS public.monthly_dues_generation_log;
DROP SEQUENCE IF EXISTS public.messages_id_seq;
DROP TABLE IF EXISTS public.messages;
DROP SEQUENCE IF EXISTS public.maintenance_id_seq;
DROP SEQUENCE IF EXISTS public.maintenance_config_id_seq;
DROP TABLE IF EXISTS public.maintenance_config;
DROP TABLE IF EXISTS public.maintenance;
DROP SEQUENCE IF EXISTS public.floors_id_seq;
DROP TABLE IF EXISTS public.floors;
DROP SEQUENCE IF EXISTS public.finance_id_seq;
DROP TABLE IF EXISTS public.finance;
DROP SEQUENCE IF EXISTS public.family_members_id_seq;
DROP TABLE IF EXISTS public.family_members;
DROP SEQUENCE IF EXISTS public.employees_id_seq;
DROP TABLE IF EXISTS public.employees;
DROP SEQUENCE IF EXISTS public.defaulters_id_seq;
DROP TABLE IF EXISTS public.defaulters;
DROP SEQUENCE IF EXISTS public.complaints_id_seq;
DROP TABLE IF EXISTS public.complaints;
DROP SEQUENCE IF EXISTS public.complaint_progress_id_seq;
DROP TABLE IF EXISTS public.complaint_progress;
DROP SEQUENCE IF EXISTS public.blocks_id_seq;
DROP TABLE IF EXISTS public.blocks;
DROP TABLE IF EXISTS public.apartments;
DROP SEQUENCE IF EXISTS public.announcements_id_seq;
DROP TABLE IF EXISTS public.announcements;
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP EXTENSION IF EXISTS "uuid-ossp";
--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: announcements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.announcements (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    type character varying(50),
    audience character varying(100),
    language character varying(20),
    visible_to_all boolean DEFAULT true,
    is_active boolean DEFAULT true,
    society_apartment_id integer NOT NULL,
    block_id integer,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    announcement_date date DEFAULT CURRENT_DATE
);


--
-- Name: COLUMN announcements.announcement_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.announcements.announcement_date IS 'Date of the announcement; defaults to current date when creating';


--
-- Name: announcements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.announcements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: announcements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.announcements_id_seq OWNED BY public.announcements.id;


--
-- Name: apartments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.apartments (
    id integer CONSTRAINT societies_id_not_null NOT NULL,
    name character varying(255) CONSTRAINT societies_name_not_null NOT NULL,
    address text,
    city character varying(100),
    total_blocks integer DEFAULT 0,
    total_units integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total_floors integer DEFAULT 0,
    area character varying(150),
    union_admin_name character varying(255),
    union_admin_email character varying(255),
    union_admin_phone character varying(50),
    is_active boolean DEFAULT true
);


--
-- Name: blocks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blocks (
    id integer NOT NULL,
    society_apartment_id integer NOT NULL,
    name character varying(100) NOT NULL,
    total_floors integer DEFAULT 0,
    total_units integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: blocks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blocks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blocks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blocks_id_seq OWNED BY public.blocks.id;


--
-- Name: complaint_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.complaint_progress (
    id integer NOT NULL,
    complaint_id integer NOT NULL,
    updated_by integer,
    status character varying(50),
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT complaint_progress_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'in_progress'::character varying, 'resolved'::character varying, 'closed'::character varying])::text[])))
);


--
-- Name: complaint_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.complaint_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: complaint_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.complaint_progress_id_seq OWNED BY public.complaint_progress.id;


--
-- Name: complaints; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.complaints (
    id integer NOT NULL,
    unit_id integer,
    society_apartment_id integer NOT NULL,
    submitted_by integer,
    assigned_to integer,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    priority character varying(20) DEFAULT 'medium'::character varying,
    is_public boolean DEFAULT false,
    attachments text[],
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    type character varying(50),
    remarks text,
    submitted_by_name_override character varying(255),
    CONSTRAINT complaints_priority_check CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::text[]))),
    CONSTRAINT complaints_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'in_progress'::character varying, 'resolved'::character varying, 'closed'::character varying])::text[])))
);


--
-- Name: COLUMN complaints.submitted_by_name_override; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.complaints.submitted_by_name_override IS 'Resident name when complaint is recorded by admin on behalf of a walk-in (submitted_by is null)';


--
-- Name: complaints_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.complaints_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: complaints_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.complaints_id_seq OWNED BY public.complaints.id;


--
-- Name: defaulters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.defaulters (
    id integer NOT NULL,
    unit_id integer NOT NULL,
    society_apartment_id integer NOT NULL,
    maintenance_id integer,
    amount_due numeric(10,2) NOT NULL,
    months_overdue integer DEFAULT 0,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    remarks text,
    CONSTRAINT defaulters_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'resolved'::character varying, 'escalated'::character varying])::text[])))
);


--
-- Name: defaulters_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.defaulters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: defaulters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.defaulters_id_seq OWNED BY public.defaulters.id;


--
-- Name: employees; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    user_id integer NOT NULL,
    society_apartment_id integer NOT NULL,
    created_by integer,
    department character varying(255),
    designation character varying(255),
    salary_rupees numeric(12,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: TABLE employees; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.employees IS 'Employment details for staff users; one row per staff, scoped by society_apartment_id and created_by union_admin';


--
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- Name: family_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.family_members (
    id integer NOT NULL,
    resident_id integer NOT NULL,
    name character varying(255) NOT NULL,
    relation character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: TABLE family_members; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.family_members IS 'Family members associated with a resident';


--
-- Name: family_members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.family_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: family_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.family_members_id_seq OWNED BY public.family_members.id;


--
-- Name: finance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance (
    id integer NOT NULL,
    society_apartment_id integer NOT NULL,
    added_by integer,
    transaction_date date NOT NULL,
    transaction_type character varying(20) NOT NULL,
    expense_type character varying(50),
    income_type character varying(50),
    description text,
    amount numeric(10,2) NOT NULL,
    payment_mode character varying(50),
    remarks text,
    month integer,
    year integer,
    status character varying(20) DEFAULT 'paid'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT finance_transaction_type_check CHECK (((transaction_type)::text = ANY ((ARRAY['income'::character varying, 'expense'::character varying])::text[])))
);


--
-- Name: finance_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.finance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: finance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.finance_id_seq OWNED BY public.finance.id;


--
-- Name: floors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.floors (
    id integer NOT NULL,
    block_id integer NOT NULL,
    floor_number integer NOT NULL,
    total_units integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: floors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.floors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: floors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.floors_id_seq OWNED BY public.floors.id;


--
-- Name: maintenance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.maintenance (
    id integer NOT NULL,
    unit_id integer NOT NULL,
    society_apartment_id integer NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    base_amount numeric(10,2) NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    amount_paid numeric(10,2) DEFAULT 0,
    due_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    payment_date date,
    CONSTRAINT maintenance_month_check CHECK (((month >= 1) AND (month <= 12))),
    CONSTRAINT maintenance_status_check CHECK (((status)::text = ANY ((ARRAY['paid'::character varying, 'partially_paid'::character varying, 'pending'::character varying])::text[])))
);


--
-- Name: maintenance_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.maintenance_config (
    id integer NOT NULL,
    society_apartment_id integer NOT NULL,
    base_amount numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    block_id integer,
    unit_id integer,
    CONSTRAINT check_maintenance_config_scope CHECK (((society_apartment_id IS NOT NULL) AND (((unit_id IS NOT NULL) AND (block_id IS NULL)) OR ((block_id IS NOT NULL) AND (unit_id IS NULL)) OR ((block_id IS NULL) AND (unit_id IS NULL)))))
);


--
-- Name: maintenance_config_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.maintenance_config_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: maintenance_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.maintenance_config_id_seq OWNED BY public.maintenance_config.id;


--
-- Name: maintenance_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.maintenance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: maintenance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.maintenance_id_seq OWNED BY public.maintenance.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    body text NOT NULL,
    read_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: monthly_dues_generation_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.monthly_dues_generation_log (
    id integer NOT NULL,
    generation_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    month integer NOT NULL,
    year integer NOT NULL,
    total_units integer NOT NULL,
    successful_generations integer DEFAULT 0,
    failed_generations integer DEFAULT 0,
    errors jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT monthly_dues_generation_log_month_check CHECK (((month >= 1) AND (month <= 12)))
);


--
-- Name: monthly_dues_generation_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.monthly_dues_generation_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: monthly_dues_generation_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.monthly_dues_generation_log_id_seq OWNED BY public.monthly_dues_generation_log.id;


--
-- Name: payment_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_history (
    id integer NOT NULL,
    maintenance_id integer NOT NULL,
    updated_by integer,
    previous_status character varying(20),
    new_status character varying(20),
    previous_amount_paid numeric(10,2),
    new_amount_paid numeric(10,2),
    amount_change numeric(10,2),
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: payment_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payment_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payment_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payment_history_id_seq OWNED BY public.payment_history.id;


--
-- Name: push_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.push_subscriptions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    endpoint text NOT NULL,
    p256dh character varying(255) NOT NULL,
    auth character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: push_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.push_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: push_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.push_subscriptions_id_seq OWNED BY public.push_subscriptions.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    society_apartment_id integer,
    defaulter_list_visible boolean DEFAULT false,
    complaint_logs_visible boolean DEFAULT false,
    financial_reports_visible boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    email_dues_on_generate boolean DEFAULT false,
    email_reminder_days_before integer DEFAULT 0
);


--
-- Name: COLUMN settings.email_dues_on_generate; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.settings.email_dues_on_generate IS 'When true, send email to residents when monthly dues are generated';


--
-- Name: COLUMN settings.email_reminder_days_before; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.settings.email_reminder_days_before IS 'Days before due date to send reminder email (0 = disabled)';


--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: societies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.societies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: societies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.societies_id_seq OWNED BY public.apartments.id;


--
-- Name: subscription_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscription_plans (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    amount numeric(10,2) DEFAULT 0 NOT NULL,
    interval_months integer DEFAULT 1 NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: subscription_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subscription_plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subscription_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subscription_plans_id_seq OWNED BY public.subscription_plans.id;


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscriptions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    society_apartment_id integer NOT NULL,
    plan_id integer,
    status character varying(30) DEFAULT 'active'::character varying NOT NULL,
    start_date date DEFAULT CURRENT_DATE NOT NULL,
    end_date date,
    next_billing_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT subscriptions_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'expired'::character varying, 'cancelled'::character varying, 'trial'::character varying, 'pending'::character varying])::text[])))
);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;


--
-- Name: super_admin_invoices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.super_admin_invoices (
    id integer NOT NULL,
    user_id integer NOT NULL,
    society_apartment_id integer NOT NULL,
    subscription_id integer,
    amount numeric(12,2) DEFAULT 0 NOT NULL,
    currency character varying(10) DEFAULT 'PKR'::character varying NOT NULL,
    status character varying(30) DEFAULT 'draft'::character varying NOT NULL,
    due_date date NOT NULL,
    period_start date NOT NULL,
    period_end date NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    payment_proof_path text,
    payment_proof_uploaded_at timestamp without time zone,
    CONSTRAINT super_admin_invoices_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'sent'::character varying, 'paid'::character varying, 'cancelled'::character varying])::text[])))
);


--
-- Name: COLUMN super_admin_invoices.payment_proof_path; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.super_admin_invoices.payment_proof_path IS 'Path to uploaded payment proof (screenshot/document) for confirming invoice amount received';


--
-- Name: COLUMN super_admin_invoices.payment_proof_uploaded_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.super_admin_invoices.payment_proof_uploaded_at IS 'When the payment proof was uploaded';


--
-- Name: super_admin_invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.super_admin_invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: super_admin_invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.super_admin_invoices_id_seq OWNED BY public.super_admin_invoices.id;


--
-- Name: union_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.union_members (
    id integer NOT NULL,
    member_name character varying(255) NOT NULL,
    designation character varying(255),
    phone character varying(50),
    email character varying(255),
    joining_date date,
    unit_id integer,
    society_apartment_id integer NOT NULL,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: TABLE union_members; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.union_members IS 'Union committee members; scoped by society_apartment_id and created_by (union_admin)';


--
-- Name: union_members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.union_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: union_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.union_members_id_seq OWNED BY public.union_members.id;


--
-- Name: units; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.units (
    id integer NOT NULL,
    society_apartment_id integer NOT NULL,
    block_id integer,
    floor_id integer,
    unit_number character varying(50) NOT NULL,
    owner_name character varying(255),
    resident_name character varying(255),
    contact_number character varying(20),
    email character varying(255),
    k_electric_account character varying(100),
    gas_account character varying(100),
    water_account character varying(100),
    phone_tv_account character varying(100),
    car_make_model character varying(255),
    license_plate character varying(50),
    number_of_cars integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    telephone_bills jsonb DEFAULT '[]'::jsonb,
    other_bills jsonb DEFAULT '[]'::jsonb,
    is_occupied boolean DEFAULT false NOT NULL
);


--
-- Name: units_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.units_id_seq OWNED BY public.units.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    society_apartment_id integer,
    unit_id integer,
    cnic character varying(20),
    contact_number character varying(20),
    emergency_contact character varying(20),
    move_in_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean,
    last_login timestamp with time zone,
    created_by integer,
    profile_image text,
    address text,
    city character varying(100),
    postal_code character varying(20),
    work_employer character varying(255),
    work_title character varying(255),
    work_phone character varying(50),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['super_admin'::character varying, 'union_admin'::character varying, 'resident'::character varying, 'staff'::character varying])::text[])))
);


--
-- Name: COLUMN users.profile_image; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.profile_image IS 'Profile image file path (e.g., /uploads/profiles/user_123_1234567890.jpg). Legacy base64 format also supported for backward compatibility.';


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: announcements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements ALTER COLUMN id SET DEFAULT nextval('public.announcements_id_seq'::regclass);


--
-- Name: apartments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.apartments ALTER COLUMN id SET DEFAULT nextval('public.societies_id_seq'::regclass);


--
-- Name: blocks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocks ALTER COLUMN id SET DEFAULT nextval('public.blocks_id_seq'::regclass);


--
-- Name: complaint_progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint_progress ALTER COLUMN id SET DEFAULT nextval('public.complaint_progress_id_seq'::regclass);


--
-- Name: complaints id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints ALTER COLUMN id SET DEFAULT nextval('public.complaints_id_seq'::regclass);


--
-- Name: defaulters id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defaulters ALTER COLUMN id SET DEFAULT nextval('public.defaulters_id_seq'::regclass);


--
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- Name: family_members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.family_members ALTER COLUMN id SET DEFAULT nextval('public.family_members_id_seq'::regclass);


--
-- Name: finance id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance ALTER COLUMN id SET DEFAULT nextval('public.finance_id_seq'::regclass);


--
-- Name: floors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.floors ALTER COLUMN id SET DEFAULT nextval('public.floors_id_seq'::regclass);


--
-- Name: maintenance id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenance ALTER COLUMN id SET DEFAULT nextval('public.maintenance_id_seq'::regclass);


--
-- Name: maintenance_config id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenance_config ALTER COLUMN id SET DEFAULT nextval('public.maintenance_config_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: monthly_dues_generation_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.monthly_dues_generation_log ALTER COLUMN id SET DEFAULT nextval('public.monthly_dues_generation_log_id_seq'::regclass);


--
-- Name: payment_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_history ALTER COLUMN id SET DEFAULT nextval('public.payment_history_id_seq'::regclass);


--
-- Name: push_subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.push_subscriptions_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Name: subscription_plans id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_plans ALTER COLUMN id SET DEFAULT nextval('public.subscription_plans_id_seq'::regclass);


--
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_id_seq'::regclass);


--
-- Name: super_admin_invoices id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.super_admin_invoices ALTER COLUMN id SET DEFAULT nextval('public.super_admin_invoices_id_seq'::regclass);


--
-- Name: union_members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.union_members ALTER COLUMN id SET DEFAULT nextval('public.union_members_id_seq'::regclass);


--
-- Name: units id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.units ALTER COLUMN id SET DEFAULT nextval('public.units_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.announcements (id, title, description, type, audience, language, visible_to_all, is_active, society_apartment_id, block_id, created_by, created_at, updated_at, announcement_date) FROM stdin;
39	Maintenance Notice	The water supply will be off.	notice	all_residents	en	t	t	31	\N	49	2026-02-24 16:08:38.400325	2026-02-24 16:08:38.400325	2025-01-03
\.


--
-- Data for Name: apartments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.apartments (id, name, address, city, total_blocks, total_units, created_at, updated_at, total_floors, area, union_admin_name, union_admin_email, union_admin_phone, is_active) FROM stdin;
31	Homeland Appartments 	Homeland Apartments, Block 13-C Block 13 C Gulshan-e-Iqbal, Karachi, 74300, Pakistan	Karachi	2	178	2026-02-20 16:46:16.689533	2026-02-23 16:26:11.543339	9	Block 13-C Block 13 C Gulshan-e-Iqbal	Muneeb Khan	\N	\N	t
\.


--
-- Data for Name: blocks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blocks (id, society_apartment_id, name, total_floors, total_units, created_at, updated_at) FROM stdin;
65	31	Block 2	8	85	2026-02-20 16:46:16.739722	2026-02-23 16:26:11.540116
64	31	Block 1	9	93	2026-02-20 16:46:16.715464	2026-02-23 15:51:43.900546
\.


--
-- Data for Name: complaint_progress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.complaint_progress (id, complaint_id, updated_by, status, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: complaints; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.complaints (id, unit_id, society_apartment_id, submitted_by, assigned_to, title, description, status, priority, is_public, attachments, created_at, updated_at, type, remarks, submitted_by_name_override) FROM stdin;
\.


--
-- Data for Name: defaulters; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.defaulters (id, unit_id, society_apartment_id, maintenance_id, amount_due, months_overdue, status, created_at, updated_at, remarks) FROM stdin;
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.employees (id, user_id, society_apartment_id, created_by, department, designation, salary_rupees, created_at, updated_at) FROM stdin;
1	228	31	49	Admin	Supervisor	25000.00	2026-02-24 13:12:03.548485	2026-02-24 13:12:03.548485
2	229	31	49	Security Guard	Guard	20000.00	2026-02-24 13:14:26.797621	2026-02-24 13:14:26.797621
3	230	31	49	Security Guard	Guard	20000.00	2026-02-24 13:14:53.440476	2026-02-24 13:14:53.440476
4	231	31	49	Security Guard	Guard	20000.00	2026-02-24 13:15:30.115282	2026-02-24 13:15:30.115282
5	232	31	49	Security Guard	Guard	20000.00	2026-02-24 13:15:51.466251	2026-02-24 13:15:51.466251
6	233	31	49	Cleaning	Sweeper	50000.00	2026-02-24 13:16:23.616287	2026-02-24 13:16:23.616287
7	234	31	49	Admin	Lift Operator	20000.00	2026-02-24 13:16:52.859042	2026-02-24 13:18:19.503275
\.


--
-- Data for Name: family_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.family_members (id, resident_id, name, relation, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: finance; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance (id, society_apartment_id, added_by, transaction_date, transaction_type, expense_type, income_type, description, amount, payment_mode, remarks, month, year, status, created_at, updated_at) FROM stdin;
135	31	49	2026-02-24	expense	Utility Payment	\N	Electricity Bill	375000.00	Cash	\N	2	2026	paid	2026-02-24 13:21:00.337117	2026-02-24 13:21:00.337117
136	31	49	2026-02-24	expense	Repairs	\N	Repair and Maintenance	50000.00	Cash	\N	2	2026	paid	2026-02-24 13:21:39.406817	2026-02-24 13:21:39.406817
\.


--
-- Data for Name: floors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.floors (id, block_id, floor_number, total_units, created_at) FROM stdin;
66	64	0	5	2026-02-20 16:46:48.987861
67	64	1	9	2026-02-20 16:47:09.078874
68	64	2	9	2026-02-20 16:47:15.490563
69	64	3	9	2026-02-20 16:47:19.785422
70	64	4	9	2026-02-20 16:47:23.28554
71	64	5	9	2026-02-20 16:47:26.238016
72	64	6	9	2026-02-20 16:47:29.649085
73	64	7	9	2026-02-20 16:47:32.693337
74	64	8	9	2026-02-20 16:47:35.466844
75	65	1	9	2026-02-20 16:47:54.433293
76	65	2	9	2026-02-20 16:47:57.76396
77	65	3	9	2026-02-20 16:48:00.396892
78	65	4	9	2026-02-20 16:48:02.866355
79	65	5	9	2026-02-20 16:48:05.355954
80	65	6	9	2026-02-20 16:48:08.213853
81	65	7	9	2026-02-20 16:48:11.763465
82	65	8	9	2026-02-20 16:48:14.727961
\.


--
-- Data for Name: maintenance; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.maintenance (id, unit_id, society_apartment_id, month, year, base_amount, total_amount, status, amount_paid, due_date, created_at, updated_at, payment_date) FROM stdin;
267	307	31	2	2026	4000.00	4000.00	paid	4000.00	2026-02-28	2026-02-23 16:48:05.609884	2026-02-23 16:50:34.944821	\N
268	307	31	3	2026	4000.00	4000.00	pending	0.00	\N	2026-02-23 16:51:39.620158	2026-02-23 16:51:39.620158	\N
269	307	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:18.961793	2026-02-23 16:58:18.961793	\N
270	307	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:18.970371	2026-02-23 16:58:18.970371	\N
271	307	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:18.975191	2026-02-23 16:58:18.975191	\N
272	307	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:18.979853	2026-02-23 16:58:18.979853	\N
273	307	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:18.984574	2026-02-23 16:58:18.984574	\N
274	307	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:18.987606	2026-02-23 16:58:18.987606	\N
275	307	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:18.99059	2026-02-23 16:58:18.99059	\N
276	307	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:18.993922	2026-02-23 16:58:18.993922	\N
277	307	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:18.999639	2026-02-23 16:58:18.999639	\N
278	307	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.002679	2026-02-23 16:58:19.002679	\N
279	308	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.004885	2026-02-23 16:58:19.004885	\N
280	308	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.007466	2026-02-23 16:58:19.007466	\N
281	308	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.010851	2026-02-23 16:58:19.010851	\N
282	308	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.015085	2026-02-23 16:58:19.015085	\N
283	308	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.017832	2026-02-23 16:58:19.017832	\N
284	308	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.020147	2026-02-23 16:58:19.020147	\N
285	308	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.022504	2026-02-23 16:58:19.022504	\N
286	308	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.025891	2026-02-23 16:58:19.025891	\N
287	308	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.028382	2026-02-23 16:58:19.028382	\N
288	308	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.032083	2026-02-23 16:58:19.032083	\N
289	308	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.0345	2026-02-23 16:58:19.0345	\N
290	308	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.037241	2026-02-23 16:58:19.037241	\N
291	309	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.040123	2026-02-23 16:58:19.040123	\N
292	309	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.042302	2026-02-23 16:58:19.042302	\N
293	309	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.044598	2026-02-23 16:58:19.044598	\N
294	309	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.048597	2026-02-23 16:58:19.048597	\N
295	309	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.051981	2026-02-23 16:58:19.051981	\N
296	309	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.054344	2026-02-23 16:58:19.054344	\N
297	309	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.056561	2026-02-23 16:58:19.056561	\N
298	309	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.058915	2026-02-23 16:58:19.058915	\N
299	309	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.061169	2026-02-23 16:58:19.061169	\N
300	309	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.065932	2026-02-23 16:58:19.065932	\N
301	309	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.068313	2026-02-23 16:58:19.068313	\N
302	309	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.070642	2026-02-23 16:58:19.070642	\N
303	310	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.072739	2026-02-23 16:58:19.072739	\N
304	310	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.075195	2026-02-23 16:58:19.075195	\N
305	310	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.077589	2026-02-23 16:58:19.077589	\N
306	310	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.082643	2026-02-23 16:58:19.082643	\N
307	310	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.086112	2026-02-23 16:58:19.086112	\N
308	310	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.088385	2026-02-23 16:58:19.088385	\N
309	310	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.090553	2026-02-23 16:58:19.090553	\N
310	310	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.093144	2026-02-23 16:58:19.093144	\N
311	310	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.095467	2026-02-23 16:58:19.095467	\N
312	310	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.100308	2026-02-23 16:58:19.100308	\N
313	310	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.103021	2026-02-23 16:58:19.103021	\N
314	310	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.105192	2026-02-23 16:58:19.105192	\N
315	311	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.10796	2026-02-23 16:58:19.10796	\N
316	311	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.110405	2026-02-23 16:58:19.110405	\N
317	311	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.114438	2026-02-23 16:58:19.114438	\N
318	311	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.117245	2026-02-23 16:58:19.117245	\N
319	311	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.119572	2026-02-23 16:58:19.119572	\N
320	311	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.121966	2026-02-23 16:58:19.121966	\N
321	311	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.12435	2026-02-23 16:58:19.12435	\N
322	311	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.127269	2026-02-23 16:58:19.127269	\N
323	311	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.130941	2026-02-23 16:58:19.130941	\N
324	311	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.133949	2026-02-23 16:58:19.133949	\N
325	311	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.136362	2026-02-23 16:58:19.136362	\N
326	311	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.138657	2026-02-23 16:58:19.138657	\N
327	579	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.140966	2026-02-23 16:58:19.140966	\N
328	579	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.143726	2026-02-23 16:58:19.143726	\N
329	579	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.147472	2026-02-23 16:58:19.147472	\N
330	579	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.150591	2026-02-23 16:58:19.150591	\N
331	579	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.153349	2026-02-23 16:58:19.153349	\N
332	579	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.156473	2026-02-23 16:58:19.156473	\N
333	579	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.159285	2026-02-23 16:58:19.159285	\N
334	579	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.164906	2026-02-23 16:58:19.164906	\N
335	579	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.172924	2026-02-23 16:58:19.172924	\N
336	579	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.178367	2026-02-23 16:58:19.178367	\N
337	579	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.183763	2026-02-23 16:58:19.183763	\N
338	579	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.186765	2026-02-23 16:58:19.186765	\N
339	313	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.190346	2026-02-23 16:58:19.190346	\N
340	313	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.192852	2026-02-23 16:58:19.192852	\N
341	313	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.195529	2026-02-23 16:58:19.195529	\N
342	313	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.198781	2026-02-23 16:58:19.198781	\N
343	313	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.201033	2026-02-23 16:58:19.201033	\N
344	313	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.203088	2026-02-23 16:58:19.203088	\N
345	313	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.205044	2026-02-23 16:58:19.205044	\N
346	313	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.207094	2026-02-23 16:58:19.207094	\N
347	313	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.208961	2026-02-23 16:58:19.208961	\N
348	313	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.210968	2026-02-23 16:58:19.210968	\N
349	313	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.215777	2026-02-23 16:58:19.215777	\N
350	313	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.217981	2026-02-23 16:58:19.217981	\N
351	314	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.219833	2026-02-23 16:58:19.219833	\N
352	314	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.221924	2026-02-23 16:58:19.221924	\N
353	314	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.22394	2026-02-23 16:58:19.22394	\N
354	314	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.225952	2026-02-23 16:58:19.225952	\N
355	314	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.22797	2026-02-23 16:58:19.22797	\N
356	314	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.23149	2026-02-23 16:58:19.23149	\N
357	314	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.233544	2026-02-23 16:58:19.233544	\N
358	314	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.235424	2026-02-23 16:58:19.235424	\N
359	314	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.237571	2026-02-23 16:58:19.237571	\N
360	314	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.239531	2026-02-23 16:58:19.239531	\N
361	314	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.241626	2026-02-23 16:58:19.241626	\N
362	314	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.243726	2026-02-23 16:58:19.243726	\N
363	315	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.246686	2026-02-23 16:58:19.246686	\N
364	315	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.249459	2026-02-23 16:58:19.249459	\N
365	315	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.251489	2026-02-23 16:58:19.251489	\N
366	315	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.253537	2026-02-23 16:58:19.253537	\N
367	315	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.255421	2026-02-23 16:58:19.255421	\N
368	315	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.257483	2026-02-23 16:58:19.257483	\N
369	315	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.259457	2026-02-23 16:58:19.259457	\N
370	315	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.261306	2026-02-23 16:58:19.261306	\N
371	315	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.264675	2026-02-23 16:58:19.264675	\N
372	315	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.266866	2026-02-23 16:58:19.266866	\N
373	315	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.268934	2026-02-23 16:58:19.268934	\N
374	315	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.270876	2026-02-23 16:58:19.270876	\N
375	316	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.272922	2026-02-23 16:58:19.272922	\N
376	316	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.274843	2026-02-23 16:58:19.274843	\N
377	316	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.276875	2026-02-23 16:58:19.276875	\N
378	316	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.279703	2026-02-23 16:58:19.279703	\N
379	316	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.28231	2026-02-23 16:58:19.28231	\N
380	316	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.284396	2026-02-23 16:58:19.284396	\N
381	316	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.286335	2026-02-23 16:58:19.286335	\N
382	316	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.288711	2026-02-23 16:58:19.288711	\N
383	316	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.291019	2026-02-23 16:58:19.291019	\N
384	316	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.293421	2026-02-23 16:58:19.293421	\N
385	316	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.296199	2026-02-23 16:58:19.296199	\N
386	316	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.299216	2026-02-23 16:58:19.299216	\N
387	317	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.301269	2026-02-23 16:58:19.301269	\N
388	317	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.303146	2026-02-23 16:58:19.303146	\N
389	317	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.305314	2026-02-23 16:58:19.305314	\N
390	317	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.307444	2026-02-23 16:58:19.307444	\N
391	317	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.309596	2026-02-23 16:58:19.309596	\N
392	317	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.311574	2026-02-23 16:58:19.311574	\N
393	317	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.315251	2026-02-23 16:58:19.315251	\N
394	317	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.317305	2026-02-23 16:58:19.317305	\N
395	317	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.319223	2026-02-23 16:58:19.319223	\N
396	317	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.321412	2026-02-23 16:58:19.321412	\N
397	317	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.323422	2026-02-23 16:58:19.323422	\N
398	317	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.325523	2026-02-23 16:58:19.325523	\N
399	318	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.327689	2026-02-23 16:58:19.327689	\N
400	318	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.331064	2026-02-23 16:58:19.331064	\N
401	318	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.333236	2026-02-23 16:58:19.333236	\N
402	318	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.335683	2026-02-23 16:58:19.335683	\N
403	318	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.338002	2026-02-23 16:58:19.338002	\N
404	318	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.340495	2026-02-23 16:58:19.340495	\N
405	318	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.342649	2026-02-23 16:58:19.342649	\N
406	318	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.344649	2026-02-23 16:58:19.344649	\N
407	318	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.34796	2026-02-23 16:58:19.34796	\N
408	318	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.35032	2026-02-23 16:58:19.35032	\N
409	318	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.35238	2026-02-23 16:58:19.35238	\N
410	318	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.354689	2026-02-23 16:58:19.354689	\N
411	319	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.357425	2026-02-23 16:58:19.357425	\N
412	319	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.360068	2026-02-23 16:58:19.360068	\N
413	319	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.363044	2026-02-23 16:58:19.363044	\N
414	319	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.367508	2026-02-23 16:58:19.367508	\N
415	319	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.369772	2026-02-23 16:58:19.369772	\N
416	319	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.372221	2026-02-23 16:58:19.372221	\N
417	319	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.374707	2026-02-23 16:58:19.374707	\N
418	319	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.377148	2026-02-23 16:58:19.377148	\N
419	319	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.380839	2026-02-23 16:58:19.380839	\N
420	319	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.383535	2026-02-23 16:58:19.383535	\N
421	319	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.385831	2026-02-23 16:58:19.385831	\N
422	319	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.387887	2026-02-23 16:58:19.387887	\N
423	320	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.38998	2026-02-23 16:58:19.38998	\N
424	320	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.39187	2026-02-23 16:58:19.39187	\N
425	320	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.393932	2026-02-23 16:58:19.393932	\N
426	320	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.39754	2026-02-23 16:58:19.39754	\N
427	320	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.400128	2026-02-23 16:58:19.400128	\N
428	320	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.402106	2026-02-23 16:58:19.402106	\N
429	320	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.404184	2026-02-23 16:58:19.404184	\N
430	320	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.406184	2026-02-23 16:58:19.406184	\N
431	320	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.408245	2026-02-23 16:58:19.408245	\N
432	320	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.410265	2026-02-23 16:58:19.410265	\N
433	320	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.41296	2026-02-23 16:58:19.41296	\N
434	320	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.415736	2026-02-23 16:58:19.415736	\N
435	321	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.417772	2026-02-23 16:58:19.417772	\N
436	321	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.419833	2026-02-23 16:58:19.419833	\N
437	321	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.421879	2026-02-23 16:58:19.421879	\N
438	321	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.424039	2026-02-23 16:58:19.424039	\N
439	321	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.425983	2026-02-23 16:58:19.425983	\N
440	321	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.428173	2026-02-23 16:58:19.428173	\N
441	321	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.431845	2026-02-23 16:58:19.431845	\N
442	321	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.434059	2026-02-23 16:58:19.434059	\N
443	321	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.436042	2026-02-23 16:58:19.436042	\N
444	321	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.437912	2026-02-23 16:58:19.437912	\N
445	321	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.439998	2026-02-23 16:58:19.439998	\N
446	321	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.441881	2026-02-23 16:58:19.441881	\N
447	322	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.443828	2026-02-23 16:58:19.443828	\N
448	322	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.446873	2026-02-23 16:58:19.446873	\N
449	322	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.450834	2026-02-23 16:58:19.450834	\N
450	322	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.452866	2026-02-23 16:58:19.452866	\N
451	322	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.454909	2026-02-23 16:58:19.454909	\N
452	322	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.456921	2026-02-23 16:58:19.456921	\N
453	322	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.458841	2026-02-23 16:58:19.458841	\N
454	322	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.460978	2026-02-23 16:58:19.460978	\N
455	322	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.46439	2026-02-23 16:58:19.46439	\N
456	322	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.466623	2026-02-23 16:58:19.466623	\N
457	322	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.468516	2026-02-23 16:58:19.468516	\N
458	322	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.470647	2026-02-23 16:58:19.470647	\N
459	323	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.472664	2026-02-23 16:58:19.472664	\N
460	323	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.474662	2026-02-23 16:58:19.474662	\N
461	323	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.476812	2026-02-23 16:58:19.476812	\N
462	323	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.479794	2026-02-23 16:58:19.479794	\N
463	323	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.482743	2026-02-23 16:58:19.482743	\N
464	323	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.485321	2026-02-23 16:58:19.485321	\N
465	323	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.487449	2026-02-23 16:58:19.487449	\N
466	323	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.489403	2026-02-23 16:58:19.489403	\N
467	323	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.491465	2026-02-23 16:58:19.491465	\N
468	323	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.493355	2026-02-23 16:58:19.493355	\N
469	323	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.495973	2026-02-23 16:58:19.495973	\N
470	323	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.498787	2026-02-23 16:58:19.498787	\N
471	325	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.501005	2026-02-23 16:58:19.501005	\N
472	325	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.502955	2026-02-23 16:58:19.502955	\N
473	325	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.504814	2026-02-23 16:58:19.504814	\N
474	325	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.507033	2026-02-23 16:58:19.507033	\N
475	325	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.509164	2026-02-23 16:58:19.509164	\N
476	325	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.511253	2026-02-23 16:58:19.511253	\N
477	325	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.514485	2026-02-23 16:58:19.514485	\N
478	325	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.516871	2026-02-23 16:58:19.516871	\N
479	325	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.518985	2026-02-23 16:58:19.518985	\N
480	325	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.521213	2026-02-23 16:58:19.521213	\N
481	325	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.523275	2026-02-23 16:58:19.523275	\N
482	325	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.525226	2026-02-23 16:58:19.525226	\N
483	326	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.527276	2026-02-23 16:58:19.527276	\N
484	326	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.530131	2026-02-23 16:58:19.530131	\N
485	326	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.532779	2026-02-23 16:58:19.532779	\N
486	326	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.53478	2026-02-23 16:58:19.53478	\N
487	326	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.536998	2026-02-23 16:58:19.536998	\N
488	326	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.538898	2026-02-23 16:58:19.538898	\N
489	326	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.540755	2026-02-23 16:58:19.540755	\N
490	326	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.542822	2026-02-23 16:58:19.542822	\N
491	326	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.544818	2026-02-23 16:58:19.544818	\N
492	326	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.547976	2026-02-23 16:58:19.547976	\N
493	326	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.550066	2026-02-23 16:58:19.550066	\N
494	326	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.552334	2026-02-23 16:58:19.552334	\N
495	327	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.555572	2026-02-23 16:58:19.555572	\N
496	327	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.559606	2026-02-23 16:58:19.559606	\N
497	327	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.564262	2026-02-23 16:58:19.564262	\N
498	327	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.570758	2026-02-23 16:58:19.570758	\N
499	327	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.573366	2026-02-23 16:58:19.573366	\N
500	327	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.576076	2026-02-23 16:58:19.576076	\N
501	327	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.578282	2026-02-23 16:58:19.578282	\N
502	327	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.582225	2026-02-23 16:58:19.582225	\N
503	327	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.584456	2026-02-23 16:58:19.584456	\N
504	327	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.586973	2026-02-23 16:58:19.586973	\N
505	327	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.589136	2026-02-23 16:58:19.589136	\N
506	327	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.591224	2026-02-23 16:58:19.591224	\N
507	328	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.593202	2026-02-23 16:58:19.593202	\N
508	328	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.595211	2026-02-23 16:58:19.595211	\N
509	328	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.598625	2026-02-23 16:58:19.598625	\N
510	328	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.600773	2026-02-23 16:58:19.600773	\N
511	328	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.602926	2026-02-23 16:58:19.602926	\N
512	328	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.60517	2026-02-23 16:58:19.60517	\N
513	328	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.607274	2026-02-23 16:58:19.607274	\N
514	328	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.609199	2026-02-23 16:58:19.609199	\N
515	328	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.611232	2026-02-23 16:58:19.611232	\N
516	328	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.614505	2026-02-23 16:58:19.614505	\N
517	328	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.616703	2026-02-23 16:58:19.616703	\N
518	328	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.618681	2026-02-23 16:58:19.618681	\N
519	329	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.620635	2026-02-23 16:58:19.620635	\N
520	329	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.622691	2026-02-23 16:58:19.622691	\N
521	329	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.624602	2026-02-23 16:58:19.624602	\N
522	329	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.626625	2026-02-23 16:58:19.626625	\N
523	329	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.628679	2026-02-23 16:58:19.628679	\N
524	329	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.632324	2026-02-23 16:58:19.632324	\N
525	329	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.634343	2026-02-23 16:58:19.634343	\N
526	329	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.636219	2026-02-23 16:58:19.636219	\N
527	329	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.638282	2026-02-23 16:58:19.638282	\N
528	329	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.640161	2026-02-23 16:58:19.640161	\N
529	329	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.642969	2026-02-23 16:58:19.642969	\N
530	329	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.646052	2026-02-23 16:58:19.646052	\N
531	330	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.649104	2026-02-23 16:58:19.649104	\N
532	330	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.651137	2026-02-23 16:58:19.651137	\N
533	330	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.652979	2026-02-23 16:58:19.652979	\N
534	330	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.65502	2026-02-23 16:58:19.65502	\N
535	330	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.656887	2026-02-23 16:58:19.656887	\N
536	330	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.658841	2026-02-23 16:58:19.658841	\N
537	330	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.660806	2026-02-23 16:58:19.660806	\N
538	330	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.664018	2026-02-23 16:58:19.664018	\N
539	330	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.666606	2026-02-23 16:58:19.666606	\N
540	330	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.668499	2026-02-23 16:58:19.668499	\N
541	330	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.670876	2026-02-23 16:58:19.670876	\N
542	330	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.673053	2026-02-23 16:58:19.673053	\N
543	331	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.675445	2026-02-23 16:58:19.675445	\N
544	331	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.677773	2026-02-23 16:58:19.677773	\N
545	331	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.681453	2026-02-23 16:58:19.681453	\N
546	331	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.68351	2026-02-23 16:58:19.68351	\N
547	331	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.685814	2026-02-23 16:58:19.685814	\N
548	331	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.687929	2026-02-23 16:58:19.687929	\N
549	331	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.689923	2026-02-23 16:58:19.689923	\N
550	331	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.691821	2026-02-23 16:58:19.691821	\N
551	331	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.693732	2026-02-23 16:58:19.693732	\N
552	331	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.69685	2026-02-23 16:58:19.69685	\N
553	331	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.699456	2026-02-23 16:58:19.699456	\N
554	331	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.701631	2026-02-23 16:58:19.701631	\N
555	332	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.703531	2026-02-23 16:58:19.703531	\N
556	332	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.705383	2026-02-23 16:58:19.705383	\N
557	332	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.707577	2026-02-23 16:58:19.707577	\N
558	332	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.709468	2026-02-23 16:58:19.709468	\N
559	332	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.711448	2026-02-23 16:58:19.711448	\N
560	332	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.714553	2026-02-23 16:58:19.714553	\N
561	332	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.716741	2026-02-23 16:58:19.716741	\N
562	332	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.718692	2026-02-23 16:58:19.718692	\N
563	332	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.720596	2026-02-23 16:58:19.720596	\N
564	332	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.722563	2026-02-23 16:58:19.722563	\N
565	332	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.724411	2026-02-23 16:58:19.724411	\N
566	332	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.726698	2026-02-23 16:58:19.726698	\N
567	333	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.72929	2026-02-23 16:58:19.72929	\N
568	333	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.73259	2026-02-23 16:58:19.73259	\N
569	333	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.734785	2026-02-23 16:58:19.734785	\N
570	333	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.736933	2026-02-23 16:58:19.736933	\N
571	333	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.73906	2026-02-23 16:58:19.73906	\N
572	333	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.740933	2026-02-23 16:58:19.740933	\N
573	333	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.742979	2026-02-23 16:58:19.742979	\N
574	333	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.745171	2026-02-23 16:58:19.745171	\N
575	333	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.748659	2026-02-23 16:58:19.748659	\N
576	333	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.750606	2026-02-23 16:58:19.750606	\N
577	333	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.752526	2026-02-23 16:58:19.752526	\N
578	333	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.754686	2026-02-23 16:58:19.754686	\N
579	334	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.757255	2026-02-23 16:58:19.757255	\N
580	334	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.759785	2026-02-23 16:58:19.759785	\N
581	334	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.763008	2026-02-23 16:58:19.763008	\N
582	334	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.765894	2026-02-23 16:58:19.765894	\N
583	334	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.770008	2026-02-23 16:58:19.770008	\N
584	334	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.772375	2026-02-23 16:58:19.772375	\N
585	334	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.774818	2026-02-23 16:58:19.774818	\N
586	334	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.776998	2026-02-23 16:58:19.776998	\N
587	334	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.780566	2026-02-23 16:58:19.780566	\N
588	334	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.783203	2026-02-23 16:58:19.783203	\N
589	334	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.786013	2026-02-23 16:58:19.786013	\N
590	334	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.78846	2026-02-23 16:58:19.78846	\N
591	335	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.790751	2026-02-23 16:58:19.790751	\N
592	335	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.792759	2026-02-23 16:58:19.792759	\N
593	335	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.794808	2026-02-23 16:58:19.794808	\N
594	335	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.79812	2026-02-23 16:58:19.79812	\N
595	335	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.800367	2026-02-23 16:58:19.800367	\N
596	335	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.802224	2026-02-23 16:58:19.802224	\N
597	335	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.804242	2026-02-23 16:58:19.804242	\N
598	335	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.80617	2026-02-23 16:58:19.80617	\N
599	335	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.808066	2026-02-23 16:58:19.808066	\N
600	335	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.810046	2026-02-23 16:58:19.810046	\N
601	335	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.811981	2026-02-23 16:58:19.811981	\N
602	335	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.815185	2026-02-23 16:58:19.815185	\N
603	337	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.817152	2026-02-23 16:58:19.817152	\N
604	337	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.818987	2026-02-23 16:58:19.818987	\N
605	337	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.821054	2026-02-23 16:58:19.821054	\N
606	337	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.822984	2026-02-23 16:58:19.822984	\N
607	337	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.824998	2026-02-23 16:58:19.824998	\N
608	337	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.827092	2026-02-23 16:58:19.827092	\N
609	337	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.829996	2026-02-23 16:58:19.829996	\N
610	337	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.832545	2026-02-23 16:58:19.832545	\N
611	337	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.834731	2026-02-23 16:58:19.834731	\N
612	337	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.836783	2026-02-23 16:58:19.836783	\N
613	337	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.838674	2026-02-23 16:58:19.838674	\N
614	337	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.840804	2026-02-23 16:58:19.840804	\N
615	338	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.842703	2026-02-23 16:58:19.842703	\N
616	338	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.844645	2026-02-23 16:58:19.844645	\N
617	338	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.848652	2026-02-23 16:58:19.848652	\N
618	338	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.85133	2026-02-23 16:58:19.85133	\N
619	338	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.854048	2026-02-23 16:58:19.854048	\N
620	338	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.865972	2026-02-23 16:58:19.865972	\N
621	338	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.868132	2026-02-23 16:58:19.868132	\N
622	338	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.870353	2026-02-23 16:58:19.870353	\N
623	338	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.872479	2026-02-23 16:58:19.872479	\N
624	338	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.874622	2026-02-23 16:58:19.874622	\N
625	338	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.876599	2026-02-23 16:58:19.876599	\N
626	338	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.878518	2026-02-23 16:58:19.878518	\N
627	339	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.881904	2026-02-23 16:58:19.881904	\N
628	339	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.884078	2026-02-23 16:58:19.884078	\N
629	339	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.885982	2026-02-23 16:58:19.885982	\N
630	339	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.88781	2026-02-23 16:58:19.88781	\N
631	339	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.88981	2026-02-23 16:58:19.88981	\N
632	339	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.891664	2026-02-23 16:58:19.891664	\N
633	339	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.893565	2026-02-23 16:58:19.893565	\N
634	339	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.896661	2026-02-23 16:58:19.896661	\N
635	339	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.899404	2026-02-23 16:58:19.899404	\N
636	339	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.901586	2026-02-23 16:58:19.901586	\N
637	339	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.903546	2026-02-23 16:58:19.903546	\N
638	339	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.905614	2026-02-23 16:58:19.905614	\N
639	340	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.90746	2026-02-23 16:58:19.90746	\N
640	340	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.9094	2026-02-23 16:58:19.9094	\N
641	340	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.911293	2026-02-23 16:58:19.911293	\N
642	340	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.914562	2026-02-23 16:58:19.914562	\N
643	340	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.916581	2026-02-23 16:58:19.916581	\N
644	340	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.918403	2026-02-23 16:58:19.918403	\N
645	340	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.920488	2026-02-23 16:58:19.920488	\N
646	340	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.922357	2026-02-23 16:58:19.922357	\N
647	340	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.924406	2026-02-23 16:58:19.924406	\N
648	340	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.926304	2026-02-23 16:58:19.926304	\N
649	340	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.928205	2026-02-23 16:58:19.928205	\N
650	340	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.931819	2026-02-23 16:58:19.931819	\N
651	341	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.93394	2026-02-23 16:58:19.93394	\N
652	341	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.935921	2026-02-23 16:58:19.935921	\N
653	341	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.937722	2026-02-23 16:58:19.937722	\N
654	341	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.939798	2026-02-23 16:58:19.939798	\N
655	341	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.941764	2026-02-23 16:58:19.941764	\N
656	341	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.943821	2026-02-23 16:58:19.943821	\N
657	341	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.946808	2026-02-23 16:58:19.946808	\N
658	341	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.949356	2026-02-23 16:58:19.949356	\N
659	341	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.951319	2026-02-23 16:58:19.951319	\N
660	341	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.953183	2026-02-23 16:58:19.953183	\N
661	341	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.956086	2026-02-23 16:58:19.956086	\N
662	341	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.959204	2026-02-23 16:58:19.959204	\N
663	342	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.961686	2026-02-23 16:58:19.961686	\N
664	342	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.965538	2026-02-23 16:58:19.965538	\N
665	342	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.970411	2026-02-23 16:58:19.970411	\N
666	342	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:19.972896	2026-02-23 16:58:19.972896	\N
667	342	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:19.975424	2026-02-23 16:58:19.975424	\N
668	342	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:19.978548	2026-02-23 16:58:19.978548	\N
669	342	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:19.983361	2026-02-23 16:58:19.983361	\N
670	342	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:19.986512	2026-02-23 16:58:19.986512	\N
671	342	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:19.989209	2026-02-23 16:58:19.989209	\N
672	342	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:19.991411	2026-02-23 16:58:19.991411	\N
673	342	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:19.993461	2026-02-23 16:58:19.993461	\N
674	342	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:19.996071	2026-02-23 16:58:19.996071	\N
675	343	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.999784	2026-02-23 16:58:19.999784	\N
676	343	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.001863	2026-02-23 16:58:20.001863	\N
677	343	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.003806	2026-02-23 16:58:20.003806	\N
678	343	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.005594	2026-02-23 16:58:20.005594	\N
679	343	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.007673	2026-02-23 16:58:20.007673	\N
680	343	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.009541	2026-02-23 16:58:20.009541	\N
681	343	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.011397	2026-02-23 16:58:20.011397	\N
682	343	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.014696	2026-02-23 16:58:20.014696	\N
683	343	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.016999	2026-02-23 16:58:20.016999	\N
684	343	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.018988	2026-02-23 16:58:20.018988	\N
685	343	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.020819	2026-02-23 16:58:20.020819	\N
686	343	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.022787	2026-02-23 16:58:20.022787	\N
687	344	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.024716	2026-02-23 16:58:20.024716	\N
688	344	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.02666	2026-02-23 16:58:20.02666	\N
689	344	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.028721	2026-02-23 16:58:20.028721	\N
690	344	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.032077	2026-02-23 16:58:20.032077	\N
691	344	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.034051	2026-02-23 16:58:20.034051	\N
692	344	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.035978	2026-02-23 16:58:20.035978	\N
693	344	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.038041	2026-02-23 16:58:20.038041	\N
694	344	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.03991	2026-02-23 16:58:20.03991	\N
695	344	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.041851	2026-02-23 16:58:20.041851	\N
696	344	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.043744	2026-02-23 16:58:20.043744	\N
697	344	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.046352	2026-02-23 16:58:20.046352	\N
698	344	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.049363	2026-02-23 16:58:20.049363	\N
699	345	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.051888	2026-02-23 16:58:20.051888	\N
700	345	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.054229	2026-02-23 16:58:20.054229	\N
701	345	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.056343	2026-02-23 16:58:20.056343	\N
702	345	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.058444	2026-02-23 16:58:20.058444	\N
703	345	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.060314	2026-02-23 16:58:20.060314	\N
704	345	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.063337	2026-02-23 16:58:20.063337	\N
705	345	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.065719	2026-02-23 16:58:20.065719	\N
706	345	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.067772	2026-02-23 16:58:20.067772	\N
707	345	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.069669	2026-02-23 16:58:20.069669	\N
708	345	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.071555	2026-02-23 16:58:20.071555	\N
709	345	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.073488	2026-02-23 16:58:20.073488	\N
710	345	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.07537	2026-02-23 16:58:20.07537	\N
711	346	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.077147	2026-02-23 16:58:20.077147	\N
712	346	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.080268	2026-02-23 16:58:20.080268	\N
713	346	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.0827	2026-02-23 16:58:20.0827	\N
714	346	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.084724	2026-02-23 16:58:20.084724	\N
715	346	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.086564	2026-02-23 16:58:20.086564	\N
716	346	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.088514	2026-02-23 16:58:20.088514	\N
717	346	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.090533	2026-02-23 16:58:20.090533	\N
718	346	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.092501	2026-02-23 16:58:20.092501	\N
719	346	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.09458	2026-02-23 16:58:20.09458	\N
720	346	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.097751	2026-02-23 16:58:20.097751	\N
721	346	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.099986	2026-02-23 16:58:20.099986	\N
722	346	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.101881	2026-02-23 16:58:20.101881	\N
723	347	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.10393	2026-02-23 16:58:20.10393	\N
724	347	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.105934	2026-02-23 16:58:20.105934	\N
725	347	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.107924	2026-02-23 16:58:20.107924	\N
726	347	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.109824	2026-02-23 16:58:20.109824	\N
727	347	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.111646	2026-02-23 16:58:20.111646	\N
728	347	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.114987	2026-02-23 16:58:20.114987	\N
729	347	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.116976	2026-02-23 16:58:20.116976	\N
730	347	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.119188	2026-02-23 16:58:20.119188	\N
731	347	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.121458	2026-02-23 16:58:20.121458	\N
732	347	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.123621	2026-02-23 16:58:20.123621	\N
733	347	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.125924	2026-02-23 16:58:20.125924	\N
734	347	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.127848	2026-02-23 16:58:20.127848	\N
735	349	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.131252	2026-02-23 16:58:20.131252	\N
736	349	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.133536	2026-02-23 16:58:20.133536	\N
737	349	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.136024	2026-02-23 16:58:20.136024	\N
738	349	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.137937	2026-02-23 16:58:20.137937	\N
739	349	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.139984	2026-02-23 16:58:20.139984	\N
740	349	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.141812	2026-02-23 16:58:20.141812	\N
741	349	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.143941	2026-02-23 16:58:20.143941	\N
742	349	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.147074	2026-02-23 16:58:20.147074	\N
743	349	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.149608	2026-02-23 16:58:20.149608	\N
744	349	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.151515	2026-02-23 16:58:20.151515	\N
745	349	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.153412	2026-02-23 16:58:20.153412	\N
746	349	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.155602	2026-02-23 16:58:20.155602	\N
747	350	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.158113	2026-02-23 16:58:20.158113	\N
748	350	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.160684	2026-02-23 16:58:20.160684	\N
749	350	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.165094	2026-02-23 16:58:20.165094	\N
750	350	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.170002	2026-02-23 16:58:20.170002	\N
751	350	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.172508	2026-02-23 16:58:20.172508	\N
752	350	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.174638	2026-02-23 16:58:20.174638	\N
753	350	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.176865	2026-02-23 16:58:20.176865	\N
754	350	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.179922	2026-02-23 16:58:20.179922	\N
755	350	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.183288	2026-02-23 16:58:20.183288	\N
756	350	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.186409	2026-02-23 16:58:20.186409	\N
757	350	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.188707	2026-02-23 16:58:20.188707	\N
758	350	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.190617	2026-02-23 16:58:20.190617	\N
759	351	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.192625	2026-02-23 16:58:20.192625	\N
760	351	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.194542	2026-02-23 16:58:20.194542	\N
761	351	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.197742	2026-02-23 16:58:20.197742	\N
762	351	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.199953	2026-02-23 16:58:20.199953	\N
763	351	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.201912	2026-02-23 16:58:20.201912	\N
764	351	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.203839	2026-02-23 16:58:20.203839	\N
765	351	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.205661	2026-02-23 16:58:20.205661	\N
766	351	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.207571	2026-02-23 16:58:20.207571	\N
767	351	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.20941	2026-02-23 16:58:20.20941	\N
768	351	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.211237	2026-02-23 16:58:20.211237	\N
769	351	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.214461	2026-02-23 16:58:20.214461	\N
770	351	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.216432	2026-02-23 16:58:20.216432	\N
771	352	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.218482	2026-02-23 16:58:20.218482	\N
772	352	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.220359	2026-02-23 16:58:20.220359	\N
773	352	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.222308	2026-02-23 16:58:20.222308	\N
774	352	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.224172	2026-02-23 16:58:20.224172	\N
775	352	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.225955	2026-02-23 16:58:20.225955	\N
776	352	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.227906	2026-02-23 16:58:20.227906	\N
777	352	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.231064	2026-02-23 16:58:20.231064	\N
778	352	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.233157	2026-02-23 16:58:20.233157	\N
779	352	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.234962	2026-02-23 16:58:20.234962	\N
780	352	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.236921	2026-02-23 16:58:20.236921	\N
781	352	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.238877	2026-02-23 16:58:20.238877	\N
782	352	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.240712	2026-02-23 16:58:20.240712	\N
783	353	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.242686	2026-02-23 16:58:20.242686	\N
784	353	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.244543	2026-02-23 16:58:20.244543	\N
785	353	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.247914	2026-02-23 16:58:20.247914	\N
786	353	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.249902	2026-02-23 16:58:20.249902	\N
787	353	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.251818	2026-02-23 16:58:20.251818	\N
788	353	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.253692	2026-02-23 16:58:20.253692	\N
789	353	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.255519	2026-02-23 16:58:20.255519	\N
790	353	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.257633	2026-02-23 16:58:20.257633	\N
791	353	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.25958	2026-02-23 16:58:20.25958	\N
792	353	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.261724	2026-02-23 16:58:20.261724	\N
793	353	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.264903	2026-02-23 16:58:20.264903	\N
794	353	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.266979	2026-02-23 16:58:20.266979	\N
795	354	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.268863	2026-02-23 16:58:20.268863	\N
796	354	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.270725	2026-02-23 16:58:20.270725	\N
797	354	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.27278	2026-02-23 16:58:20.27278	\N
798	354	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.274677	2026-02-23 16:58:20.274677	\N
799	354	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.276599	2026-02-23 16:58:20.276599	\N
800	354	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.278864	2026-02-23 16:58:20.278864	\N
801	354	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.281907	2026-02-23 16:58:20.281907	\N
802	354	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.28386	2026-02-23 16:58:20.28386	\N
803	354	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.285741	2026-02-23 16:58:20.285741	\N
804	354	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.287772	2026-02-23 16:58:20.287772	\N
805	354	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.289682	2026-02-23 16:58:20.289682	\N
806	354	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.291579	2026-02-23 16:58:20.291579	\N
807	355	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.293456	2026-02-23 16:58:20.293456	\N
808	355	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.295337	2026-02-23 16:58:20.295337	\N
809	355	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.298541	2026-02-23 16:58:20.298541	\N
810	355	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.30054	2026-02-23 16:58:20.30054	\N
811	355	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.30245	2026-02-23 16:58:20.30245	\N
812	355	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.304426	2026-02-23 16:58:20.304426	\N
813	355	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.306284	2026-02-23 16:58:20.306284	\N
814	355	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.308213	2026-02-23 16:58:20.308213	\N
815	355	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.310081	2026-02-23 16:58:20.310081	\N
816	355	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.312802	2026-02-23 16:58:20.312802	\N
817	355	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.31561	2026-02-23 16:58:20.31561	\N
818	355	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.31761	2026-02-23 16:58:20.31761	\N
819	356	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.319622	2026-02-23 16:58:20.319622	\N
820	356	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.321589	2026-02-23 16:58:20.321589	\N
821	356	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.323415	2026-02-23 16:58:20.323415	\N
822	356	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.325378	2026-02-23 16:58:20.325378	\N
823	356	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.32721	2026-02-23 16:58:20.32721	\N
824	356	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.330003	2026-02-23 16:58:20.330003	\N
825	356	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.332289	2026-02-23 16:58:20.332289	\N
826	356	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.334379	2026-02-23 16:58:20.334379	\N
827	356	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.336329	2026-02-23 16:58:20.336329	\N
828	356	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.33814	2026-02-23 16:58:20.33814	\N
829	356	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.34021	2026-02-23 16:58:20.34021	\N
830	356	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.342083	2026-02-23 16:58:20.342083	\N
831	357	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.344073	2026-02-23 16:58:20.344073	\N
832	357	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.347014	2026-02-23 16:58:20.347014	\N
833	357	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.349354	2026-02-23 16:58:20.349354	\N
834	357	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.351519	2026-02-23 16:58:20.351519	\N
835	357	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.35356	2026-02-23 16:58:20.35356	\N
836	357	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.3558	2026-02-23 16:58:20.3558	\N
837	357	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.358359	2026-02-23 16:58:20.358359	\N
838	357	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.361103	2026-02-23 16:58:20.361103	\N
839	357	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.364707	2026-02-23 16:58:20.364707	\N
840	357	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.369015	2026-02-23 16:58:20.369015	\N
841	357	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.372	2026-02-23 16:58:20.372	\N
842	357	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.374147	2026-02-23 16:58:20.374147	\N
843	358	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.376412	2026-02-23 16:58:20.376412	\N
844	358	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.378416	2026-02-23 16:58:20.378416	\N
845	358	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.382303	2026-02-23 16:58:20.382303	\N
846	358	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.384424	2026-02-23 16:58:20.384424	\N
847	358	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.386961	2026-02-23 16:58:20.386961	\N
848	358	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.388961	2026-02-23 16:58:20.388961	\N
849	358	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.39089	2026-02-23 16:58:20.39089	\N
850	358	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.392782	2026-02-23 16:58:20.392782	\N
851	358	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.394611	2026-02-23 16:58:20.394611	\N
852	358	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.397935	2026-02-23 16:58:20.397935	\N
853	358	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.39992	2026-02-23 16:58:20.39992	\N
854	358	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.401839	2026-02-23 16:58:20.401839	\N
855	359	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.403724	2026-02-23 16:58:20.403724	\N
856	359	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.405479	2026-02-23 16:58:20.405479	\N
857	359	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.407549	2026-02-23 16:58:20.407549	\N
858	359	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.409511	2026-02-23 16:58:20.409511	\N
859	359	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.411349	2026-02-23 16:58:20.411349	\N
860	359	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.414948	2026-02-23 16:58:20.414948	\N
861	359	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.417152	2026-02-23 16:58:20.417152	\N
862	359	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.419093	2026-02-23 16:58:20.419093	\N
863	359	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.420912	2026-02-23 16:58:20.420912	\N
864	359	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.422923	2026-02-23 16:58:20.422923	\N
865	359	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.424779	2026-02-23 16:58:20.424779	\N
866	359	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.426686	2026-02-23 16:58:20.426686	\N
867	361	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.428857	2026-02-23 16:58:20.428857	\N
868	361	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.431671	2026-02-23 16:58:20.431671	\N
869	361	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.433774	2026-02-23 16:58:20.433774	\N
870	361	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.435585	2026-02-23 16:58:20.435585	\N
871	361	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.437528	2026-02-23 16:58:20.437528	\N
872	361	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.439408	2026-02-23 16:58:20.439408	\N
873	361	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.441272	2026-02-23 16:58:20.441272	\N
874	361	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.443347	2026-02-23 16:58:20.443347	\N
875	361	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.445365	2026-02-23 16:58:20.445365	\N
876	361	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.449612	2026-02-23 16:58:20.449612	\N
877	361	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.452556	2026-02-23 16:58:20.452556	\N
878	361	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.455146	2026-02-23 16:58:20.455146	\N
879	362	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.458302	2026-02-23 16:58:20.458302	\N
880	362	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.460874	2026-02-23 16:58:20.460874	\N
881	362	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.464987	2026-02-23 16:58:20.464987	\N
882	362	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.467251	2026-02-23 16:58:20.467251	\N
883	362	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.469145	2026-02-23 16:58:20.469145	\N
884	362	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.471053	2026-02-23 16:58:20.471053	\N
885	362	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.473012	2026-02-23 16:58:20.473012	\N
886	362	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.474797	2026-02-23 16:58:20.474797	\N
887	362	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.476651	2026-02-23 16:58:20.476651	\N
888	362	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.478855	2026-02-23 16:58:20.478855	\N
889	362	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.481836	2026-02-23 16:58:20.481836	\N
890	362	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.483857	2026-02-23 16:58:20.483857	\N
891	363	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.485683	2026-02-23 16:58:20.485683	\N
892	363	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.487657	2026-02-23 16:58:20.487657	\N
893	363	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.489591	2026-02-23 16:58:20.489591	\N
894	363	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.491412	2026-02-23 16:58:20.491412	\N
895	363	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.493387	2026-02-23 16:58:20.493387	\N
896	363	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.495267	2026-02-23 16:58:20.495267	\N
897	363	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.498618	2026-02-23 16:58:20.498618	\N
898	363	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.500612	2026-02-23 16:58:20.500612	\N
899	363	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.502484	2026-02-23 16:58:20.502484	\N
900	363	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.504476	2026-02-23 16:58:20.504476	\N
901	363	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.506302	2026-02-23 16:58:20.506302	\N
902	363	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.508246	2026-02-23 16:58:20.508246	\N
903	364	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.51011	2026-02-23 16:58:20.51011	\N
904	364	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.512071	2026-02-23 16:58:20.512071	\N
905	364	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.515204	2026-02-23 16:58:20.515204	\N
906	364	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.51723	2026-02-23 16:58:20.51723	\N
907	364	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.519283	2026-02-23 16:58:20.519283	\N
908	364	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.521184	2026-02-23 16:58:20.521184	\N
909	364	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.523172	2026-02-23 16:58:20.523172	\N
910	364	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.525071	2026-02-23 16:58:20.525071	\N
911	364	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.526985	2026-02-23 16:58:20.526985	\N
912	364	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.53038	2026-02-23 16:58:20.53038	\N
913	364	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.533352	2026-02-23 16:58:20.533352	\N
914	364	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.535542	2026-02-23 16:58:20.535542	\N
915	365	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.537418	2026-02-23 16:58:20.537418	\N
916	365	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.539903	2026-02-23 16:58:20.539903	\N
917	365	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.541819	2026-02-23 16:58:20.541819	\N
918	365	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.543944	2026-02-23 16:58:20.543944	\N
919	365	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.546865	2026-02-23 16:58:20.546865	\N
920	365	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.549399	2026-02-23 16:58:20.549399	\N
921	365	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.551454	2026-02-23 16:58:20.551454	\N
922	365	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.55334	2026-02-23 16:58:20.55334	\N
923	365	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.555396	2026-02-23 16:58:20.555396	\N
924	365	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.557919	2026-02-23 16:58:20.557919	\N
925	365	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.560686	2026-02-23 16:58:20.560686	\N
926	365	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.564165	2026-02-23 16:58:20.564165	\N
927	366	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.570054	2026-02-23 16:58:20.570054	\N
928	366	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.573563	2026-02-23 16:58:20.573563	\N
929	366	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.598088	2026-02-23 16:58:20.598088	\N
930	366	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.600151	2026-02-23 16:58:20.600151	\N
931	366	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.602138	2026-02-23 16:58:20.602138	\N
932	366	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.604087	2026-02-23 16:58:20.604087	\N
933	366	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.605856	2026-02-23 16:58:20.605856	\N
934	366	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.607892	2026-02-23 16:58:20.607892	\N
935	366	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.609708	2026-02-23 16:58:20.609708	\N
936	366	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.611641	2026-02-23 16:58:20.611641	\N
937	366	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.615078	2026-02-23 16:58:20.615078	\N
938	366	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.6173	2026-02-23 16:58:20.6173	\N
939	367	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.619187	2026-02-23 16:58:20.619187	\N
940	367	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.621077	2026-02-23 16:58:20.621077	\N
941	367	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.62305	2026-02-23 16:58:20.62305	\N
942	367	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.624921	2026-02-23 16:58:20.624921	\N
943	367	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.626834	2026-02-23 16:58:20.626834	\N
944	367	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.629403	2026-02-23 16:58:20.629403	\N
945	367	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.632339	2026-02-23 16:58:20.632339	\N
946	367	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.634391	2026-02-23 16:58:20.634391	\N
947	367	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.636239	2026-02-23 16:58:20.636239	\N
948	367	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.638316	2026-02-23 16:58:20.638316	\N
949	367	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.640394	2026-02-23 16:58:20.640394	\N
950	367	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.642866	2026-02-23 16:58:20.642866	\N
951	368	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.647256	2026-02-23 16:58:20.647256	\N
952	368	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.650102	2026-02-23 16:58:20.650102	\N
953	368	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.652177	2026-02-23 16:58:20.652177	\N
954	368	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.654098	2026-02-23 16:58:20.654098	\N
955	368	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.65591	2026-02-23 16:58:20.65591	\N
956	368	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.657935	2026-02-23 16:58:20.657935	\N
957	368	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.659859	2026-02-23 16:58:20.659859	\N
958	368	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.661948	2026-02-23 16:58:20.661948	\N
959	368	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.665258	2026-02-23 16:58:20.665258	\N
960	368	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.667733	2026-02-23 16:58:20.667733	\N
961	368	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.669672	2026-02-23 16:58:20.669672	\N
962	368	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.671578	2026-02-23 16:58:20.671578	\N
963	369	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.67345	2026-02-23 16:58:20.67345	\N
964	369	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.675258	2026-02-23 16:58:20.675258	\N
965	369	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.677242	2026-02-23 16:58:20.677242	\N
966	369	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.680123	2026-02-23 16:58:20.680123	\N
967	369	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.682612	2026-02-23 16:58:20.682612	\N
968	369	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.684527	2026-02-23 16:58:20.684527	\N
969	369	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.686273	2026-02-23 16:58:20.686273	\N
970	369	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.688209	2026-02-23 16:58:20.688209	\N
971	369	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.689986	2026-02-23 16:58:20.689986	\N
972	369	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.691875	2026-02-23 16:58:20.691875	\N
973	369	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.693747	2026-02-23 16:58:20.693747	\N
974	369	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.696326	2026-02-23 16:58:20.696326	\N
975	370	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.699079	2026-02-23 16:58:20.699079	\N
976	370	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.700923	2026-02-23 16:58:20.700923	\N
977	370	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.702944	2026-02-23 16:58:20.702944	\N
978	370	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.705254	2026-02-23 16:58:20.705254	\N
979	370	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.707487	2026-02-23 16:58:20.707487	\N
980	370	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.709933	2026-02-23 16:58:20.709933	\N
981	370	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.712085	2026-02-23 16:58:20.712085	\N
982	370	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.715061	2026-02-23 16:58:20.715061	\N
983	370	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.71728	2026-02-23 16:58:20.71728	\N
984	370	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.719466	2026-02-23 16:58:20.719466	\N
985	370	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.721301	2026-02-23 16:58:20.721301	\N
986	370	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.723287	2026-02-23 16:58:20.723287	\N
987	371	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.725092	2026-02-23 16:58:20.725092	\N
988	371	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.727051	2026-02-23 16:58:20.727051	\N
989	371	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.729497	2026-02-23 16:58:20.729497	\N
990	371	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.732374	2026-02-23 16:58:20.732374	\N
991	371	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.734553	2026-02-23 16:58:20.734553	\N
992	371	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.736909	2026-02-23 16:58:20.736909	\N
993	371	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.738908	2026-02-23 16:58:20.738908	\N
994	371	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.740734	2026-02-23 16:58:20.740734	\N
995	371	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.742624	2026-02-23 16:58:20.742624	\N
996	371	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.744501	2026-02-23 16:58:20.744501	\N
997	371	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.747793	2026-02-23 16:58:20.747793	\N
998	371	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.750229	2026-02-23 16:58:20.750229	\N
999	373	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.752536	2026-02-23 16:58:20.752536	\N
1000	373	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.754693	2026-02-23 16:58:20.754693	\N
1001	373	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.757468	2026-02-23 16:58:20.757468	\N
1002	373	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.760836	2026-02-23 16:58:20.760836	\N
1003	373	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.764564	2026-02-23 16:58:20.764564	\N
1004	373	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.771081	2026-02-23 16:58:20.771081	\N
1005	373	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.773341	2026-02-23 16:58:20.773341	\N
1006	373	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.775774	2026-02-23 16:58:20.775774	\N
1007	373	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.777881	2026-02-23 16:58:20.777881	\N
1008	373	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.781515	2026-02-23 16:58:20.781515	\N
1009	373	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.783833	2026-02-23 16:58:20.783833	\N
1010	373	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.786229	2026-02-23 16:58:20.786229	\N
1011	374	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.788395	2026-02-23 16:58:20.788395	\N
1012	374	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.790532	2026-02-23 16:58:20.790532	\N
1013	374	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.792433	2026-02-23 16:58:20.792433	\N
1014	374	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.794237	2026-02-23 16:58:20.794237	\N
1015	374	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.797346	2026-02-23 16:58:20.797346	\N
1016	374	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.799508	2026-02-23 16:58:20.799508	\N
1017	374	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.801862	2026-02-23 16:58:20.801862	\N
1018	374	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.804339	2026-02-23 16:58:20.804339	\N
1019	374	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.806363	2026-02-23 16:58:20.806363	\N
1020	374	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.808255	2026-02-23 16:58:20.808255	\N
1021	374	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.810218	2026-02-23 16:58:20.810218	\N
1022	374	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.812488	2026-02-23 16:58:20.812488	\N
1023	375	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.815448	2026-02-23 16:58:20.815448	\N
1024	375	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.81745	2026-02-23 16:58:20.81745	\N
1025	375	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.81978	2026-02-23 16:58:20.81978	\N
1026	375	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.821644	2026-02-23 16:58:20.821644	\N
1027	375	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.82341	2026-02-23 16:58:20.82341	\N
1028	375	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.825345	2026-02-23 16:58:20.825345	\N
1029	375	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.827172	2026-02-23 16:58:20.827172	\N
1030	375	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.829718	2026-02-23 16:58:20.829718	\N
1031	375	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.832258	2026-02-23 16:58:20.832258	\N
1032	375	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.834305	2026-02-23 16:58:20.834305	\N
1033	375	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.836331	2026-02-23 16:58:20.836331	\N
1034	375	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.838147	2026-02-23 16:58:20.838147	\N
1035	376	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.840094	2026-02-23 16:58:20.840094	\N
1036	376	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.841894	2026-02-23 16:58:20.841894	\N
1037	376	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.843697	2026-02-23 16:58:20.843697	\N
1038	376	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.846274	2026-02-23 16:58:20.846274	\N
1039	376	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.848919	2026-02-23 16:58:20.848919	\N
1040	376	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.851466	2026-02-23 16:58:20.851466	\N
1041	376	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.854325	2026-02-23 16:58:20.854325	\N
1042	376	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.856778	2026-02-23 16:58:20.856778	\N
1043	376	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.858815	2026-02-23 16:58:20.858815	\N
1044	376	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.860893	2026-02-23 16:58:20.860893	\N
1045	376	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.865507	2026-02-23 16:58:20.865507	\N
1046	376	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.869303	2026-02-23 16:58:20.869303	\N
1047	377	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.873022	2026-02-23 16:58:20.873022	\N
1048	377	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.875114	2026-02-23 16:58:20.875114	\N
1049	377	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.879697	2026-02-23 16:58:20.879697	\N
1050	377	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.883936	2026-02-23 16:58:20.883936	\N
1051	377	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.888586	2026-02-23 16:58:20.888586	\N
1052	377	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.892605	2026-02-23 16:58:20.892605	\N
1053	377	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.898042	2026-02-23 16:58:20.898042	\N
1054	377	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.900191	2026-02-23 16:58:20.900191	\N
1055	377	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.904397	2026-02-23 16:58:20.904397	\N
1056	377	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.907643	2026-02-23 16:58:20.907643	\N
1057	377	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.909778	2026-02-23 16:58:20.909778	\N
1058	377	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.911695	2026-02-23 16:58:20.911695	\N
1059	378	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.914938	2026-02-23 16:58:20.914938	\N
1060	378	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.916842	2026-02-23 16:58:20.916842	\N
1061	378	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.918747	2026-02-23 16:58:20.918747	\N
1062	378	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.920653	2026-02-23 16:58:20.920653	\N
1063	378	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.922431	2026-02-23 16:58:20.922431	\N
1064	378	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.9243	2026-02-23 16:58:20.9243	\N
1065	378	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.926135	2026-02-23 16:58:20.926135	\N
1066	378	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.9279	2026-02-23 16:58:20.9279	\N
1067	378	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.93118	2026-02-23 16:58:20.93118	\N
1068	378	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.933069	2026-02-23 16:58:20.933069	\N
1069	378	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.935157	2026-02-23 16:58:20.935157	\N
1070	378	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.937004	2026-02-23 16:58:20.937004	\N
1071	379	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.938965	2026-02-23 16:58:20.938965	\N
1072	379	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.940907	2026-02-23 16:58:20.940907	\N
1073	379	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.942684	2026-02-23 16:58:20.942684	\N
1074	379	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.94484	2026-02-23 16:58:20.94484	\N
1075	379	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.948067	2026-02-23 16:58:20.948067	\N
1076	379	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.950299	2026-02-23 16:58:20.950299	\N
1077	379	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.952139	2026-02-23 16:58:20.952139	\N
1078	379	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.95429	2026-02-23 16:58:20.95429	\N
1079	379	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.95668	2026-02-23 16:58:20.95668	\N
1080	379	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.959216	2026-02-23 16:58:20.959216	\N
1081	379	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.961687	2026-02-23 16:58:20.961687	\N
1082	379	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.964845	2026-02-23 16:58:20.964845	\N
1083	380	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.968372	2026-02-23 16:58:20.968372	\N
1084	380	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.971041	2026-02-23 16:58:20.971041	\N
1085	380	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.973267	2026-02-23 16:58:20.973267	\N
1086	380	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:20.975478	2026-02-23 16:58:20.975478	\N
1087	380	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:20.977458	2026-02-23 16:58:20.977458	\N
1088	380	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:20.981019	2026-02-23 16:58:20.981019	\N
1089	380	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:20.983382	2026-02-23 16:58:20.983382	\N
1090	380	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:20.985898	2026-02-23 16:58:20.985898	\N
1091	380	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:20.987864	2026-02-23 16:58:20.987864	\N
1092	380	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:20.989868	2026-02-23 16:58:20.989868	\N
1093	380	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:20.991732	2026-02-23 16:58:20.991732	\N
1094	380	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:20.993823	2026-02-23 16:58:20.993823	\N
1095	381	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.996915	2026-02-23 16:58:20.996915	\N
1096	381	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.999336	2026-02-23 16:58:20.999336	\N
1097	381	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.001298	2026-02-23 16:58:21.001298	\N
1098	381	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.003293	2026-02-23 16:58:21.003293	\N
1099	381	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.005394	2026-02-23 16:58:21.005394	\N
1100	381	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.007304	2026-02-23 16:58:21.007304	\N
1101	381	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.009211	2026-02-23 16:58:21.009211	\N
1102	381	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.01104	2026-02-23 16:58:21.01104	\N
1103	381	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.014485	2026-02-23 16:58:21.014485	\N
1104	381	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.016515	2026-02-23 16:58:21.016515	\N
1105	381	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.018317	2026-02-23 16:58:21.018317	\N
1106	381	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.020219	2026-02-23 16:58:21.020219	\N
1107	382	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.022027	2026-02-23 16:58:21.022027	\N
1108	382	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.023783	2026-02-23 16:58:21.023783	\N
1109	382	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.025747	2026-02-23 16:58:21.025747	\N
1110	382	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.027533	2026-02-23 16:58:21.027533	\N
1111	382	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.030986	2026-02-23 16:58:21.030986	\N
1112	382	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.033279	2026-02-23 16:58:21.033279	\N
1113	382	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.035113	2026-02-23 16:58:21.035113	\N
1114	382	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.03704	2026-02-23 16:58:21.03704	\N
1115	382	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.038781	2026-02-23 16:58:21.038781	\N
1116	382	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.040585	2026-02-23 16:58:21.040585	\N
1117	382	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.04248	2026-02-23 16:58:21.04248	\N
1118	382	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.044232	2026-02-23 16:58:21.044232	\N
1119	383	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.04775	2026-02-23 16:58:21.04775	\N
1120	383	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.049928	2026-02-23 16:58:21.049928	\N
1121	383	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.051838	2026-02-23 16:58:21.051838	\N
1122	383	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.053577	2026-02-23 16:58:21.053577	\N
1123	383	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.055281	2026-02-23 16:58:21.055281	\N
1124	383	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.057122	2026-02-23 16:58:21.057122	\N
1125	383	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.058915	2026-02-23 16:58:21.058915	\N
1126	383	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.060788	2026-02-23 16:58:21.060788	\N
1127	383	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.064704	2026-02-23 16:58:21.064704	\N
1128	383	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.068086	2026-02-23 16:58:21.068086	\N
1129	383	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.070079	2026-02-23 16:58:21.070079	\N
1130	383	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.072159	2026-02-23 16:58:21.072159	\N
1131	385	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.07407	2026-02-23 16:58:21.07407	\N
1132	385	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.075852	2026-02-23 16:58:21.075852	\N
1133	385	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.077846	2026-02-23 16:58:21.077846	\N
1134	385	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.080824	2026-02-23 16:58:21.080824	\N
1135	385	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.082947	2026-02-23 16:58:21.082947	\N
1136	385	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.084797	2026-02-23 16:58:21.084797	\N
1137	385	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.086593	2026-02-23 16:58:21.086593	\N
1138	385	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.088527	2026-02-23 16:58:21.088527	\N
1139	385	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.090452	2026-02-23 16:58:21.090452	\N
1140	385	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.092267	2026-02-23 16:58:21.092267	\N
1141	385	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.094197	2026-02-23 16:58:21.094197	\N
1142	385	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.097121	2026-02-23 16:58:21.097121	\N
1143	386	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.099392	2026-02-23 16:58:21.099392	\N
1144	386	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.101197	2026-02-23 16:58:21.101197	\N
1145	386	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.103092	2026-02-23 16:58:21.103092	\N
1146	386	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.104897	2026-02-23 16:58:21.104897	\N
1147	386	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.106634	2026-02-23 16:58:21.106634	\N
1148	386	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.108494	2026-02-23 16:58:21.108494	\N
1149	386	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.110398	2026-02-23 16:58:21.110398	\N
1150	386	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.113466	2026-02-23 16:58:21.113466	\N
1151	386	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.115938	2026-02-23 16:58:21.115938	\N
1152	386	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.117919	2026-02-23 16:58:21.117919	\N
1153	386	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.120024	2026-02-23 16:58:21.120024	\N
1154	386	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.122044	2026-02-23 16:58:21.122044	\N
1155	387	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.124042	2026-02-23 16:58:21.124042	\N
1156	387	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.125882	2026-02-23 16:58:21.125882	\N
1157	387	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.127838	2026-02-23 16:58:21.127838	\N
1158	387	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.130874	2026-02-23 16:58:21.130874	\N
1159	387	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.133139	2026-02-23 16:58:21.133139	\N
1160	387	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.13503	2026-02-23 16:58:21.13503	\N
1161	387	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.136897	2026-02-23 16:58:21.136897	\N
1162	387	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.13883	2026-02-23 16:58:21.13883	\N
1163	387	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.140662	2026-02-23 16:58:21.140662	\N
1164	387	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.142541	2026-02-23 16:58:21.142541	\N
1165	387	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.144437	2026-02-23 16:58:21.144437	\N
1166	387	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.147375	2026-02-23 16:58:21.147375	\N
1167	388	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.149955	2026-02-23 16:58:21.149955	\N
1168	388	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.151976	2026-02-23 16:58:21.151976	\N
1169	388	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.15397	2026-02-23 16:58:21.15397	\N
1170	388	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.156169	2026-02-23 16:58:21.156169	\N
1171	388	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.158843	2026-02-23 16:58:21.158843	\N
1172	388	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.161298	2026-02-23 16:58:21.161298	\N
1173	388	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.16515	2026-02-23 16:58:21.16515	\N
1174	388	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.169213	2026-02-23 16:58:21.169213	\N
1175	388	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.171506	2026-02-23 16:58:21.171506	\N
1176	388	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.173881	2026-02-23 16:58:21.173881	\N
1177	388	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.176186	2026-02-23 16:58:21.176186	\N
1178	388	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.178222	2026-02-23 16:58:21.178222	\N
1179	389	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.182222	2026-02-23 16:58:21.182222	\N
1180	389	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.185641	2026-02-23 16:58:21.185641	\N
1181	389	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.18846	2026-02-23 16:58:21.18846	\N
1182	389	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.190663	2026-02-23 16:58:21.190663	\N
1183	389	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.192555	2026-02-23 16:58:21.192555	\N
1184	389	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.194349	2026-02-23 16:58:21.194349	\N
1185	389	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.19772	2026-02-23 16:58:21.19772	\N
1186	389	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.19995	2026-02-23 16:58:21.19995	\N
1187	389	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.202005	2026-02-23 16:58:21.202005	\N
1188	389	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.203818	2026-02-23 16:58:21.203818	\N
1189	389	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.205816	2026-02-23 16:58:21.205816	\N
1190	389	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.207658	2026-02-23 16:58:21.207658	\N
1191	390	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.209524	2026-02-23 16:58:21.209524	\N
1192	390	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.211385	2026-02-23 16:58:21.211385	\N
1193	390	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.214619	2026-02-23 16:58:21.214619	\N
1194	390	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.216685	2026-02-23 16:58:21.216685	\N
1195	390	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.218508	2026-02-23 16:58:21.218508	\N
1196	390	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.220535	2026-02-23 16:58:21.220535	\N
1197	390	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.222443	2026-02-23 16:58:21.222443	\N
1198	390	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.224428	2026-02-23 16:58:21.224428	\N
1199	390	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.226506	2026-02-23 16:58:21.226506	\N
1200	390	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.228363	2026-02-23 16:58:21.228363	\N
1201	390	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.231726	2026-02-23 16:58:21.231726	\N
1202	390	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.233711	2026-02-23 16:58:21.233711	\N
1203	391	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.235644	2026-02-23 16:58:21.235644	\N
1204	391	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.237481	2026-02-23 16:58:21.237481	\N
1205	391	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.239215	2026-02-23 16:58:21.239215	\N
1206	391	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.241204	2026-02-23 16:58:21.241204	\N
1207	391	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.243001	2026-02-23 16:58:21.243001	\N
1208	391	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.244833	2026-02-23 16:58:21.244833	\N
1209	391	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.248058	2026-02-23 16:58:21.248058	\N
1210	391	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.250106	2026-02-23 16:58:21.250106	\N
1211	391	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.251939	2026-02-23 16:58:21.251939	\N
1212	391	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.253699	2026-02-23 16:58:21.253699	\N
1213	391	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.255585	2026-02-23 16:58:21.255585	\N
1214	391	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.257406	2026-02-23 16:58:21.257406	\N
1215	392	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.259277	2026-02-23 16:58:21.259277	\N
1216	392	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.261339	2026-02-23 16:58:21.261339	\N
1217	392	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.264596	2026-02-23 16:58:21.264596	\N
1218	392	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.266752	2026-02-23 16:58:21.266752	\N
1219	392	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.268609	2026-02-23 16:58:21.268609	\N
1220	392	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.27055	2026-02-23 16:58:21.27055	\N
1221	392	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.272407	2026-02-23 16:58:21.272407	\N
1222	392	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.274176	2026-02-23 16:58:21.274176	\N
1223	392	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.276071	2026-02-23 16:58:21.276071	\N
1224	392	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.277861	2026-02-23 16:58:21.277861	\N
1225	392	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.281301	2026-02-23 16:58:21.281301	\N
1226	392	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.28335	2026-02-23 16:58:21.28335	\N
1227	393	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.285278	2026-02-23 16:58:21.285278	\N
1228	393	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.287109	2026-02-23 16:58:21.287109	\N
1229	393	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.288865	2026-02-23 16:58:21.288865	\N
1230	393	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.290837	2026-02-23 16:58:21.290837	\N
1231	393	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.292628	2026-02-23 16:58:21.292628	\N
1232	393	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.294392	2026-02-23 16:58:21.294392	\N
1233	393	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.297529	2026-02-23 16:58:21.297529	\N
1234	393	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.299673	2026-02-23 16:58:21.299673	\N
1235	393	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.30169	2026-02-23 16:58:21.30169	\N
1236	393	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.303478	2026-02-23 16:58:21.303478	\N
1237	393	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.305539	2026-02-23 16:58:21.305539	\N
1238	393	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.307395	2026-02-23 16:58:21.307395	\N
1239	394	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.309161	2026-02-23 16:58:21.309161	\N
1240	394	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.311193	2026-02-23 16:58:21.311193	\N
1241	394	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.314247	2026-02-23 16:58:21.314247	\N
1242	394	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.316359	2026-02-23 16:58:21.316359	\N
1243	394	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.318226	2026-02-23 16:58:21.318226	\N
1244	394	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.320361	2026-02-23 16:58:21.320361	\N
1245	394	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.322237	2026-02-23 16:58:21.322237	\N
1246	394	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.323997	2026-02-23 16:58:21.323997	\N
1247	394	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.325979	2026-02-23 16:58:21.325979	\N
1248	394	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.327765	2026-02-23 16:58:21.327765	\N
1249	394	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.331107	2026-02-23 16:58:21.331107	\N
1250	394	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.333588	2026-02-23 16:58:21.333588	\N
1251	395	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.335753	2026-02-23 16:58:21.335753	\N
1252	395	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.337641	2026-02-23 16:58:21.337641	\N
1253	395	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.339578	2026-02-23 16:58:21.339578	\N
1254	395	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.34156	2026-02-23 16:58:21.34156	\N
1255	395	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.343343	2026-02-23 16:58:21.343343	\N
1256	395	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.345456	2026-02-23 16:58:21.345456	\N
1257	395	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.348401	2026-02-23 16:58:21.348401	\N
1258	395	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.35051	2026-02-23 16:58:21.35051	\N
1259	395	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.352407	2026-02-23 16:58:21.352407	\N
1260	395	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.354185	2026-02-23 16:58:21.354185	\N
1261	395	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.356308	2026-02-23 16:58:21.356308	\N
1262	395	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.358772	2026-02-23 16:58:21.358772	\N
1263	397	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.361354	2026-02-23 16:58:21.361354	\N
1264	397	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.364872	2026-02-23 16:58:21.364872	\N
1265	397	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.370106	2026-02-23 16:58:21.370106	\N
1266	397	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.3722	2026-02-23 16:58:21.3722	\N
1267	397	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.374501	2026-02-23 16:58:21.374501	\N
1268	397	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.37659	2026-02-23 16:58:21.37659	\N
1269	397	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.379084	2026-02-23 16:58:21.379084	\N
1270	397	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.382123	2026-02-23 16:58:21.382123	\N
1271	397	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.384421	2026-02-23 16:58:21.384421	\N
1272	397	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.386705	2026-02-23 16:58:21.386705	\N
1273	397	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.388803	2026-02-23 16:58:21.388803	\N
1274	397	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.390769	2026-02-23 16:58:21.390769	\N
1275	398	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.392513	2026-02-23 16:58:21.392513	\N
1276	398	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.394399	2026-02-23 16:58:21.394399	\N
1277	398	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.39794	2026-02-23 16:58:21.39794	\N
1278	398	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.400422	2026-02-23 16:58:21.400422	\N
1279	398	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.402553	2026-02-23 16:58:21.402553	\N
1280	398	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.40461	2026-02-23 16:58:21.40461	\N
1281	398	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.406499	2026-02-23 16:58:21.406499	\N
1282	398	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.40827	2026-02-23 16:58:21.40827	\N
1283	398	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.410194	2026-02-23 16:58:21.410194	\N
1284	398	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.412718	2026-02-23 16:58:21.412718	\N
1285	398	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.415454	2026-02-23 16:58:21.415454	\N
1286	398	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.417368	2026-02-23 16:58:21.417368	\N
1287	399	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.419214	2026-02-23 16:58:21.419214	\N
1288	399	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.421342	2026-02-23 16:58:21.421342	\N
1289	399	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.423268	2026-02-23 16:58:21.423268	\N
1290	399	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.425192	2026-02-23 16:58:21.425192	\N
1291	399	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.427082	2026-02-23 16:58:21.427082	\N
1292	399	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.429639	2026-02-23 16:58:21.429639	\N
1293	399	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.4324	2026-02-23 16:58:21.4324	\N
1294	399	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.434209	2026-02-23 16:58:21.434209	\N
1295	399	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.436191	2026-02-23 16:58:21.436191	\N
1296	399	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.437996	2026-02-23 16:58:21.437996	\N
1297	399	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.439914	2026-02-23 16:58:21.439914	\N
1298	399	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.441768	2026-02-23 16:58:21.441768	\N
1299	400	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.443507	2026-02-23 16:58:21.443507	\N
1300	400	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.446107	2026-02-23 16:58:21.446107	\N
1301	400	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.44857	2026-02-23 16:58:21.44857	\N
1302	400	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.45055	2026-02-23 16:58:21.45055	\N
1303	400	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.452416	2026-02-23 16:58:21.452416	\N
1304	400	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.454154	2026-02-23 16:58:21.454154	\N
1305	400	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.45614	2026-02-23 16:58:21.45614	\N
1306	400	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.45795	2026-02-23 16:58:21.45795	\N
1307	400	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.459894	2026-02-23 16:58:21.459894	\N
1308	400	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.461709	2026-02-23 16:58:21.461709	\N
1309	400	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.46517	2026-02-23 16:58:21.46517	\N
1310	400	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.467124	2026-02-23 16:58:21.467124	\N
1311	401	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.468956	2026-02-23 16:58:21.468956	\N
1312	401	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.470963	2026-02-23 16:58:21.470963	\N
1313	401	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.472765	2026-02-23 16:58:21.472765	\N
1314	401	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.474581	2026-02-23 16:58:21.474581	\N
1315	401	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.476449	2026-02-23 16:58:21.476449	\N
1316	401	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.478237	2026-02-23 16:58:21.478237	\N
1317	401	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.48138	2026-02-23 16:58:21.48138	\N
1318	401	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.483313	2026-02-23 16:58:21.483313	\N
1319	401	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.485186	2026-02-23 16:58:21.485186	\N
1320	401	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.487027	2026-02-23 16:58:21.487027	\N
1321	401	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.488835	2026-02-23 16:58:21.488835	\N
1322	401	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.491012	2026-02-23 16:58:21.491012	\N
1323	402	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.492852	2026-02-23 16:58:21.492852	\N
1324	402	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.494785	2026-02-23 16:58:21.494785	\N
1325	402	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.497954	2026-02-23 16:58:21.497954	\N
1326	402	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.500036	2026-02-23 16:58:21.500036	\N
1327	402	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.502243	2026-02-23 16:58:21.502243	\N
1328	402	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.503996	2026-02-23 16:58:21.503996	\N
1329	402	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.506116	2026-02-23 16:58:21.506116	\N
1330	402	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.507921	2026-02-23 16:58:21.507921	\N
1331	402	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.5098	2026-02-23 16:58:21.5098	\N
1332	402	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.511735	2026-02-23 16:58:21.511735	\N
1333	402	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.514803	2026-02-23 16:58:21.514803	\N
1334	402	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.517106	2026-02-23 16:58:21.517106	\N
1335	403	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.519087	2026-02-23 16:58:21.519087	\N
1336	403	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.521401	2026-02-23 16:58:21.521401	\N
1337	403	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.523295	2026-02-23 16:58:21.523295	\N
1338	403	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.525072	2026-02-23 16:58:21.525072	\N
1339	403	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.527072	2026-02-23 16:58:21.527072	\N
1340	403	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.529802	2026-02-23 16:58:21.529802	\N
1341	403	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.532725	2026-02-23 16:58:21.532725	\N
1342	403	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.534866	2026-02-23 16:58:21.534866	\N
1343	403	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.53705	2026-02-23 16:58:21.53705	\N
1344	403	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.539074	2026-02-23 16:58:21.539074	\N
1345	403	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.540903	2026-02-23 16:58:21.540903	\N
1346	403	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.542865	2026-02-23 16:58:21.542865	\N
1347	404	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.544705	2026-02-23 16:58:21.544705	\N
1348	404	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.548007	2026-02-23 16:58:21.548007	\N
1349	404	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.549971	2026-02-23 16:58:21.549971	\N
1350	404	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.552054	2026-02-23 16:58:21.552054	\N
1351	404	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.553915	2026-02-23 16:58:21.553915	\N
1352	404	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.555674	2026-02-23 16:58:21.555674	\N
1353	404	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.557801	2026-02-23 16:58:21.557801	\N
1354	404	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.560279	2026-02-23 16:58:21.560279	\N
1355	404	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.563718	2026-02-23 16:58:21.563718	\N
1356	404	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.566591	2026-02-23 16:58:21.566591	\N
1357	404	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.568725	2026-02-23 16:58:21.568725	\N
1358	404	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.573554	2026-02-23 16:58:21.573554	\N
1359	405	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.575777	2026-02-23 16:58:21.575777	\N
1360	405	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.578011	2026-02-23 16:58:21.578011	\N
1361	405	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.581457	2026-02-23 16:58:21.581457	\N
1362	405	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.583714	2026-02-23 16:58:21.583714	\N
1363	405	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.585769	2026-02-23 16:58:21.585769	\N
1364	405	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.588091	2026-02-23 16:58:21.588091	\N
1365	405	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.590358	2026-02-23 16:58:21.590358	\N
1366	405	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.592327	2026-02-23 16:58:21.592327	\N
1367	405	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.594264	2026-02-23 16:58:21.594264	\N
1368	405	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.597368	2026-02-23 16:58:21.597368	\N
1369	405	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.599535	2026-02-23 16:58:21.599535	\N
1370	405	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.601329	2026-02-23 16:58:21.601329	\N
1371	406	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.603273	2026-02-23 16:58:21.603273	\N
1372	406	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.605187	2026-02-23 16:58:21.605187	\N
1373	406	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.606979	2026-02-23 16:58:21.606979	\N
1374	406	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.608857	2026-02-23 16:58:21.608857	\N
1375	406	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.610676	2026-02-23 16:58:21.610676	\N
1376	406	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.613409	2026-02-23 16:58:21.613409	\N
1377	406	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.615763	2026-02-23 16:58:21.615763	\N
1378	406	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.617676	2026-02-23 16:58:21.617676	\N
1379	406	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.619529	2026-02-23 16:58:21.619529	\N
1380	406	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.62126	2026-02-23 16:58:21.62126	\N
1381	406	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.623185	2026-02-23 16:58:21.623185	\N
1382	406	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.625089	2026-02-23 16:58:21.625089	\N
1383	407	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.626874	2026-02-23 16:58:21.626874	\N
1384	407	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.629683	2026-02-23 16:58:21.629683	\N
1385	407	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.632084	2026-02-23 16:58:21.632084	\N
1386	407	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.634077	2026-02-23 16:58:21.634077	\N
1387	407	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.635825	2026-02-23 16:58:21.635825	\N
1388	407	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.637667	2026-02-23 16:58:21.637667	\N
1389	407	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.63952	2026-02-23 16:58:21.63952	\N
1390	407	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.641338	2026-02-23 16:58:21.641338	\N
1391	407	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.64336	2026-02-23 16:58:21.64336	\N
1392	407	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.645939	2026-02-23 16:58:21.645939	\N
1393	407	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.648591	2026-02-23 16:58:21.648591	\N
1394	407	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.650471	2026-02-23 16:58:21.650471	\N
1395	491	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.65223	2026-02-23 16:58:21.65223	\N
1396	491	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.654144	2026-02-23 16:58:21.654144	\N
1397	491	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.655882	2026-02-23 16:58:21.655882	\N
1398	491	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.657705	2026-02-23 16:58:21.657705	\N
1399	491	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.659583	2026-02-23 16:58:21.659583	\N
1400	491	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.661317	2026-02-23 16:58:21.661317	\N
1401	491	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.664541	2026-02-23 16:58:21.664541	\N
1402	491	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.666575	2026-02-23 16:58:21.666575	\N
1403	491	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.668565	2026-02-23 16:58:21.668565	\N
1404	491	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.670378	2026-02-23 16:58:21.670378	\N
1405	491	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.672186	2026-02-23 16:58:21.672186	\N
1406	491	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.674125	2026-02-23 16:58:21.674125	\N
1407	492	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.676135	2026-02-23 16:58:21.676135	\N
1408	492	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.678059	2026-02-23 16:58:21.678059	\N
1409	492	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.681153	2026-02-23 16:58:21.681153	\N
1410	492	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.683293	2026-02-23 16:58:21.683293	\N
1411	492	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.685355	2026-02-23 16:58:21.685355	\N
1412	492	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.687134	2026-02-23 16:58:21.687134	\N
1413	492	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.689106	2026-02-23 16:58:21.689106	\N
1414	492	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.690865	2026-02-23 16:58:21.690865	\N
1415	492	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.692696	2026-02-23 16:58:21.692696	\N
1416	492	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.69456	2026-02-23 16:58:21.69456	\N
1417	492	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.697704	2026-02-23 16:58:21.697704	\N
1418	492	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.699832	2026-02-23 16:58:21.699832	\N
1419	493	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.701639	2026-02-23 16:58:21.701639	\N
1420	493	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.703594	2026-02-23 16:58:21.703594	\N
1421	493	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.705515	2026-02-23 16:58:21.705515	\N
1422	493	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.70729	2026-02-23 16:58:21.70729	\N
1423	493	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.709221	2026-02-23 16:58:21.709221	\N
1424	493	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.710994	2026-02-23 16:58:21.710994	\N
1425	493	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.714043	2026-02-23 16:58:21.714043	\N
1426	493	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.716096	2026-02-23 16:58:21.716096	\N
1427	493	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.718003	2026-02-23 16:58:21.718003	\N
1428	493	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.719838	2026-02-23 16:58:21.719838	\N
1429	493	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.721604	2026-02-23 16:58:21.721604	\N
1430	493	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.723496	2026-02-23 16:58:21.723496	\N
1431	494	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.725409	2026-02-23 16:58:21.725409	\N
1432	494	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.727211	2026-02-23 16:58:21.727211	\N
1433	494	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.729946	2026-02-23 16:58:21.729946	\N
1434	494	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.732343	2026-02-23 16:58:21.732343	\N
1435	494	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.734366	2026-02-23 16:58:21.734366	\N
1436	494	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.736189	2026-02-23 16:58:21.736189	\N
1437	494	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.738098	2026-02-23 16:58:21.738098	\N
1438	494	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.739949	2026-02-23 16:58:21.739949	\N
1439	494	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.74173	2026-02-23 16:58:21.74173	\N
1440	494	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.743729	2026-02-23 16:58:21.743729	\N
1441	494	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.746278	2026-02-23 16:58:21.746278	\N
1442	494	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.749117	2026-02-23 16:58:21.749117	\N
1443	495	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.751198	2026-02-23 16:58:21.751198	\N
1444	495	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.753288	2026-02-23 16:58:21.753288	\N
1445	495	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.755214	2026-02-23 16:58:21.755214	\N
1446	495	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.757052	2026-02-23 16:58:21.757052	\N
1447	495	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.759176	2026-02-23 16:58:21.759176	\N
1448	495	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.761528	2026-02-23 16:58:21.761528	\N
1449	495	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.765141	2026-02-23 16:58:21.765141	\N
1450	495	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.76754	2026-02-23 16:58:21.76754	\N
1451	495	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.769813	2026-02-23 16:58:21.769813	\N
1452	495	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.773749	2026-02-23 16:58:21.773749	\N
1453	495	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.776182	2026-02-23 16:58:21.776182	\N
1454	495	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.778281	2026-02-23 16:58:21.778281	\N
1455	496	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.781826	2026-02-23 16:58:21.781826	\N
1456	496	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.784387	2026-02-23 16:58:21.784387	\N
1457	496	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.786759	2026-02-23 16:58:21.786759	\N
1458	496	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.789316	2026-02-23 16:58:21.789316	\N
1459	496	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.79229	2026-02-23 16:58:21.79229	\N
1460	496	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.794429	2026-02-23 16:58:21.794429	\N
1461	496	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.798129	2026-02-23 16:58:21.798129	\N
1462	496	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.800186	2026-02-23 16:58:21.800186	\N
1463	496	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.802174	2026-02-23 16:58:21.802174	\N
1464	496	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.804054	2026-02-23 16:58:21.804054	\N
1465	496	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.805839	2026-02-23 16:58:21.805839	\N
1466	496	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.807776	2026-02-23 16:58:21.807776	\N
1467	497	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.809606	2026-02-23 16:58:21.809606	\N
1468	497	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.811509	2026-02-23 16:58:21.811509	\N
1469	497	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.814761	2026-02-23 16:58:21.814761	\N
1470	497	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.816775	2026-02-23 16:58:21.816775	\N
1471	497	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.818684	2026-02-23 16:58:21.818684	\N
1472	497	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.820435	2026-02-23 16:58:21.820435	\N
1473	497	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.822449	2026-02-23 16:58:21.822449	\N
1474	497	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.824262	2026-02-23 16:58:21.824262	\N
1475	497	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.825992	2026-02-23 16:58:21.825992	\N
1476	497	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.827933	2026-02-23 16:58:21.827933	\N
1477	497	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.831373	2026-02-23 16:58:21.831373	\N
1478	497	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.83416	2026-02-23 16:58:21.83416	\N
1479	498	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.836418	2026-02-23 16:58:21.836418	\N
1480	498	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.838514	2026-02-23 16:58:21.838514	\N
1481	498	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.840383	2026-02-23 16:58:21.840383	\N
1482	498	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.842607	2026-02-23 16:58:21.842607	\N
1483	498	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.844908	2026-02-23 16:58:21.844908	\N
1484	498	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.84883	2026-02-23 16:58:21.84883	\N
1485	498	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.850873	2026-02-23 16:58:21.850873	\N
1486	498	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.852929	2026-02-23 16:58:21.852929	\N
1487	498	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.854993	2026-02-23 16:58:21.854993	\N
1488	498	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.856828	2026-02-23 16:58:21.856828	\N
1489	498	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.858825	2026-02-23 16:58:21.858825	\N
1490	498	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.860655	2026-02-23 16:58:21.860655	\N
1491	499	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.86352	2026-02-23 16:58:21.86352	\N
1492	499	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.865799	2026-02-23 16:58:21.865799	\N
1493	499	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.867674	2026-02-23 16:58:21.867674	\N
1494	499	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.869554	2026-02-23 16:58:21.869554	\N
1495	499	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.871363	2026-02-23 16:58:21.871363	\N
1496	499	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.873371	2026-02-23 16:58:21.873371	\N
1497	499	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.875255	2026-02-23 16:58:21.875255	\N
1498	499	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.87705	2026-02-23 16:58:21.87705	\N
1499	499	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.879621	2026-02-23 16:58:21.879621	\N
1500	499	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.882162	2026-02-23 16:58:21.882162	\N
1501	499	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.884373	2026-02-23 16:58:21.884373	\N
1502	499	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.886205	2026-02-23 16:58:21.886205	\N
1503	500	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.888135	2026-02-23 16:58:21.888135	\N
1504	500	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.890149	2026-02-23 16:58:21.890149	\N
1505	500	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.892025	2026-02-23 16:58:21.892025	\N
1506	500	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.894052	2026-02-23 16:58:21.894052	\N
1507	500	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.896814	2026-02-23 16:58:21.896814	\N
1508	500	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.899336	2026-02-23 16:58:21.899336	\N
1509	500	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.901277	2026-02-23 16:58:21.901277	\N
1510	500	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.903103	2026-02-23 16:58:21.903103	\N
1511	500	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.905076	2026-02-23 16:58:21.905076	\N
1512	500	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.906846	2026-02-23 16:58:21.906846	\N
1513	500	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.908814	2026-02-23 16:58:21.908814	\N
1514	500	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.910662	2026-02-23 16:58:21.910662	\N
1515	501	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.91411	2026-02-23 16:58:21.91411	\N
1516	501	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.916851	2026-02-23 16:58:21.916851	\N
1517	501	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.919264	2026-02-23 16:58:21.919264	\N
1518	501	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.921313	2026-02-23 16:58:21.921313	\N
1519	501	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.923203	2026-02-23 16:58:21.923203	\N
1520	501	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.92513	2026-02-23 16:58:21.92513	\N
1521	501	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.926894	2026-02-23 16:58:21.926894	\N
1522	501	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.92963	2026-02-23 16:58:21.92963	\N
1523	501	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.932034	2026-02-23 16:58:21.932034	\N
1524	501	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.934079	2026-02-23 16:58:21.934079	\N
1525	501	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.935953	2026-02-23 16:58:21.935953	\N
1526	501	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.937757	2026-02-23 16:58:21.937757	\N
1527	502	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.939966	2026-02-23 16:58:21.939966	\N
1528	502	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.942027	2026-02-23 16:58:21.942027	\N
1529	502	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.944142	2026-02-23 16:58:21.944142	\N
1530	502	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.946955	2026-02-23 16:58:21.946955	\N
1531	502	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.949502	2026-02-23 16:58:21.949502	\N
1532	502	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.951375	2026-02-23 16:58:21.951375	\N
1533	502	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.953168	2026-02-23 16:58:21.953168	\N
1534	502	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.955119	2026-02-23 16:58:21.955119	\N
1535	502	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.956878	2026-02-23 16:58:21.956878	\N
1536	502	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.958766	2026-02-23 16:58:21.958766	\N
1537	502	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.961553	2026-02-23 16:58:21.961553	\N
1538	502	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.965193	2026-02-23 16:58:21.965193	\N
1539	503	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.967633	2026-02-23 16:58:21.967633	\N
1540	503	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.969919	2026-02-23 16:58:21.969919	\N
1541	503	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.974267	2026-02-23 16:58:21.974267	\N
1542	503	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:21.976578	2026-02-23 16:58:21.976578	\N
1543	503	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:21.978872	2026-02-23 16:58:21.978872	\N
1544	503	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:21.982555	2026-02-23 16:58:21.982555	\N
1545	503	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:21.984603	2026-02-23 16:58:21.984603	\N
1546	503	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:21.986822	2026-02-23 16:58:21.986822	\N
1547	503	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:21.988896	2026-02-23 16:58:21.988896	\N
1548	503	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:21.991141	2026-02-23 16:58:21.991141	\N
1549	503	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:21.993298	2026-02-23 16:58:21.993298	\N
1550	503	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:21.996019	2026-02-23 16:58:21.996019	\N
1551	504	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.999242	2026-02-23 16:58:21.999242	\N
1552	504	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.00167	2026-02-23 16:58:22.00167	\N
1553	504	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.003785	2026-02-23 16:58:22.003785	\N
1554	504	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:22.005971	2026-02-23 16:58:22.005971	\N
1555	504	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:22.008083	2026-02-23 16:58:22.008083	\N
1556	504	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:22.01011	2026-02-23 16:58:22.01011	\N
1557	504	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:22.012981	2026-02-23 16:58:22.012981	\N
1558	504	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:22.015808	2026-02-23 16:58:22.015808	\N
1559	504	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:22.01794	2026-02-23 16:58:22.01794	\N
1560	504	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:22.019986	2026-02-23 16:58:22.019986	\N
1561	504	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:22.022237	2026-02-23 16:58:22.022237	\N
1562	504	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:22.024121	2026-02-23 16:58:22.024121	\N
1563	505	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.026664	2026-02-23 16:58:22.026664	\N
1564	505	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.028623	2026-02-23 16:58:22.028623	\N
1565	505	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.032016	2026-02-23 16:58:22.032016	\N
1566	505	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:22.033969	2026-02-23 16:58:22.033969	\N
1567	505	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:22.035911	2026-02-23 16:58:22.035911	\N
1568	505	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:22.037769	2026-02-23 16:58:22.037769	\N
1569	505	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:22.039566	2026-02-23 16:58:22.039566	\N
1570	505	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:22.041485	2026-02-23 16:58:22.041485	\N
1571	505	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:22.043291	2026-02-23 16:58:22.043291	\N
1572	505	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:22.045342	2026-02-23 16:58:22.045342	\N
1573	505	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:22.048753	2026-02-23 16:58:22.048753	\N
1574	505	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:22.051079	2026-02-23 16:58:22.051079	\N
1575	506	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.053166	2026-02-23 16:58:22.053166	\N
1576	506	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.055022	2026-02-23 16:58:22.055022	\N
1577	506	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.056994	2026-02-23 16:58:22.056994	\N
1578	506	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:22.058766	2026-02-23 16:58:22.058766	\N
1579	506	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:22.06098	2026-02-23 16:58:22.06098	\N
1580	506	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:22.064609	2026-02-23 16:58:22.064609	\N
1581	506	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:22.066728	2026-02-23 16:58:22.066728	\N
1582	506	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:22.068596	2026-02-23 16:58:22.068596	\N
1583	506	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:22.070334	2026-02-23 16:58:22.070334	\N
1584	506	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:22.072233	2026-02-23 16:58:22.072233	\N
1585	506	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:22.074164	2026-02-23 16:58:22.074164	\N
1586	506	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:22.076031	2026-02-23 16:58:22.076031	\N
1587	507	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.078034	2026-02-23 16:58:22.078034	\N
1588	507	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.081208	2026-02-23 16:58:22.081208	\N
1589	507	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.083328	2026-02-23 16:58:22.083328	\N
1590	507	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:22.085145	2026-02-23 16:58:22.085145	\N
1591	507	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:22.087107	2026-02-23 16:58:22.087107	\N
1592	507	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:22.088943	2026-02-23 16:58:22.088943	\N
1593	507	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:22.090667	2026-02-23 16:58:22.090667	\N
1594	507	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:22.092569	2026-02-23 16:58:22.092569	\N
1595	507	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:22.094444	2026-02-23 16:58:22.094444	\N
1596	507	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:22.097601	2026-02-23 16:58:22.097601	\N
1597	507	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:22.099778	2026-02-23 16:58:22.099778	\N
1598	507	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:22.101795	2026-02-23 16:58:22.101795	\N
1599	508	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.103708	2026-02-23 16:58:22.103708	\N
1600	508	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.105453	2026-02-23 16:58:22.105453	\N
1601	508	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.107453	2026-02-23 16:58:22.107453	\N
1602	508	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:22.109216	2026-02-23 16:58:22.109216	\N
1603	508	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:22.111012	2026-02-23 16:58:22.111012	\N
1604	508	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:22.114229	2026-02-23 16:58:22.114229	\N
1605	508	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:22.116278	2026-02-23 16:58:22.116278	\N
1606	508	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:22.118206	2026-02-23 16:58:22.118206	\N
1607	508	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:22.120127	2026-02-23 16:58:22.120127	\N
1608	508	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:22.1224	2026-02-23 16:58:22.1224	\N
1609	508	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:22.124297	2026-02-23 16:58:22.124297	\N
1610	508	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:22.126152	2026-02-23 16:58:22.126152	\N
1611	509	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.12805	2026-02-23 16:58:22.12805	\N
1612	509	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.131305	2026-02-23 16:58:22.131305	\N
1613	509	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.133555	2026-02-23 16:58:22.133555	\N
1614	509	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:22.135428	2026-02-23 16:58:22.135428	\N
1615	509	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:22.137455	2026-02-23 16:58:22.137455	\N
1616	509	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:22.13935	2026-02-23 16:58:22.13935	\N
1617	509	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:22.141189	2026-02-23 16:58:22.141189	\N
1618	509	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:22.143092	2026-02-23 16:58:22.143092	\N
1619	509	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:22.144952	2026-02-23 16:58:22.144952	\N
1620	509	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:22.148118	2026-02-23 16:58:22.148118	\N
1621	509	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:22.150178	2026-02-23 16:58:22.150178	\N
1622	509	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:22.151985	2026-02-23 16:58:22.151985	\N
1623	510	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.153967	2026-02-23 16:58:22.153967	\N
1624	510	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.155793	2026-02-23 16:58:22.155793	\N
1625	510	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.157785	2026-02-23 16:58:22.157785	\N
1626	510	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:22.159927	2026-02-23 16:58:22.159927	\N
1627	510	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:22.163731	2026-02-23 16:58:22.163731	\N
1628	510	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:22.166373	2026-02-23 16:58:22.166373	\N
1629	510	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:22.16867	2026-02-23 16:58:22.16867	\N
1630	510	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:22.171132	2026-02-23 16:58:22.171132	\N
1631	510	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:22.175105	2026-02-23 16:58:22.175105	\N
1632	510	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:22.177298	2026-02-23 16:58:22.177298	\N
1633	510	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:22.181604	2026-02-23 16:58:22.181604	\N
1634	510	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:22.186294	2026-02-23 16:58:22.186294	\N
1635	511	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.188335	2026-02-23 16:58:22.188335	\N
1636	511	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.190765	2026-02-23 16:58:22.190765	\N
1637	511	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.193317	2026-02-23 16:58:22.193317	\N
1638	511	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:22.195361	2026-02-23 16:58:22.195361	\N
1639	511	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:22.198452	2026-02-23 16:58:22.198452	\N
1640	511	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:22.208279	2026-02-23 16:58:22.208279	\N
1641	511	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:22.210094	2026-02-23 16:58:22.210094	\N
1642	511	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:22.211863	2026-02-23 16:58:22.211863	\N
1643	511	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:22.215148	2026-02-23 16:58:22.215148	\N
1644	511	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:22.21716	2026-02-23 16:58:22.21716	\N
1645	511	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:22.220569	2026-02-23 16:58:22.220569	\N
1646	511	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:22.22237	2026-02-23 16:58:22.22237	\N
1647	512	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.224272	2026-02-23 16:58:22.224272	\N
1648	512	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.226055	2026-02-23 16:58:22.226055	\N
1649	512	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.228057	2026-02-23 16:58:22.228057	\N
1650	512	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:22.231188	2026-02-23 16:58:22.231188	\N
1651	512	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:22.235605	2026-02-23 16:58:22.235605	\N
1652	512	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:22.237511	2026-02-23 16:58:22.237511	\N
1653	512	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:22.239319	2026-02-23 16:58:22.239319	\N
1654	512	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:22.241235	2026-02-23 16:58:22.241235	\N
1655	512	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:22.242945	2026-02-23 16:58:22.242945	\N
1656	512	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:22.244792	2026-02-23 16:58:22.244792	\N
1657	512	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:22.248676	2026-02-23 16:58:22.248676	\N
1658	512	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:22.298344	2026-02-23 16:58:22.298344	\N
1659	513	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.653853	2026-02-23 16:58:22.653853	\N
1660	513	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.667434	2026-02-23 16:58:22.667434	\N
1661	513	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.741666	2026-02-23 16:58:22.741666	\N
1662	513	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:22.748239	2026-02-23 16:58:22.748239	\N
1663	513	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:22.752946	2026-02-23 16:58:22.752946	\N
1664	513	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:22.757796	2026-02-23 16:58:22.757796	\N
1665	513	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:22.763555	2026-02-23 16:58:22.763555	\N
1666	513	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:22.768504	2026-02-23 16:58:22.768504	\N
1667	513	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:22.7727	2026-02-23 16:58:22.7727	\N
1668	513	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:22.776776	2026-02-23 16:58:22.776776	\N
1669	513	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:22.784303	2026-02-23 16:58:22.784303	\N
1670	513	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:22.789657	2026-02-23 16:58:22.789657	\N
1671	514	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.797789	2026-02-23 16:58:22.797789	\N
1672	514	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.801555	2026-02-23 16:58:22.801555	\N
1673	514	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.80495	2026-02-23 16:58:22.80495	\N
1674	514	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:22.807826	2026-02-23 16:58:22.807826	\N
1675	514	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:22.810494	2026-02-23 16:58:22.810494	\N
1676	514	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:22.814091	2026-02-23 16:58:22.814091	\N
1677	514	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:22.81652	2026-02-23 16:58:22.81652	\N
1678	514	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:22.818425	2026-02-23 16:58:22.818425	\N
1679	514	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:22.820652	2026-02-23 16:58:22.820652	\N
1680	514	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:22.82278	2026-02-23 16:58:22.82278	\N
1681	514	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:22.825072	2026-02-23 16:58:22.825072	\N
1682	514	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:22.827481	2026-02-23 16:58:22.827481	\N
1683	515	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.831226	2026-02-23 16:58:22.831226	\N
1684	515	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.833197	2026-02-23 16:58:22.833197	\N
1685	515	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.835085	2026-02-23 16:58:22.835085	\N
1686	515	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:22.836966	2026-02-23 16:58:22.836966	\N
1687	515	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:22.838786	2026-02-23 16:58:22.838786	\N
1688	515	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:22.840749	2026-02-23 16:58:22.840749	\N
1689	515	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:22.842488	2026-02-23 16:58:22.842488	\N
1690	515	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:22.844184	2026-02-23 16:58:22.844184	\N
1691	515	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:22.847296	2026-02-23 16:58:22.847296	\N
1692	515	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:22.849582	2026-02-23 16:58:22.849582	\N
1693	515	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:22.851517	2026-02-23 16:58:22.851517	\N
1694	515	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:22.853328	2026-02-23 16:58:22.853328	\N
1695	516	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.855273	2026-02-23 16:58:22.855273	\N
1696	516	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.857711	2026-02-23 16:58:22.857711	\N
1697	516	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.860164	2026-02-23 16:58:22.860164	\N
1698	516	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:22.863377	2026-02-23 16:58:22.863377	\N
1699	516	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:22.865871	2026-02-23 16:58:22.865871	\N
1700	516	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:22.870032	2026-02-23 16:58:22.870032	\N
1701	516	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:22.872597	2026-02-23 16:58:22.872597	\N
1702	516	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:22.874867	2026-02-23 16:58:22.874867	\N
1703	516	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:22.87747	2026-02-23 16:58:22.87747	\N
1704	516	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:22.881441	2026-02-23 16:58:22.881441	\N
1705	516	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:22.884351	2026-02-23 16:58:22.884351	\N
1706	516	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:22.88782	2026-02-23 16:58:22.88782	\N
1707	517	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.890184	2026-02-23 16:58:22.890184	\N
1708	517	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.892137	2026-02-23 16:58:22.892137	\N
1709	517	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.893912	2026-02-23 16:58:22.893912	\N
1710	517	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:22.896395	2026-02-23 16:58:22.896395	\N
1711	517	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:22.898897	2026-02-23 16:58:22.898897	\N
1712	517	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:22.900653	2026-02-23 16:58:22.900653	\N
1713	517	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:22.902712	2026-02-23 16:58:22.902712	\N
1714	517	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:22.904616	2026-02-23 16:58:22.904616	\N
1715	517	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:22.906341	2026-02-23 16:58:22.906341	\N
1716	517	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:22.908233	2026-02-23 16:58:22.908233	\N
1717	517	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:22.909979	2026-02-23 16:58:22.909979	\N
1718	517	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:22.91191	2026-02-23 16:58:22.91191	\N
1719	518	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.9149	2026-02-23 16:58:22.9149	\N
1720	518	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.917003	2026-02-23 16:58:22.917003	\N
1721	518	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.919271	2026-02-23 16:58:22.919271	\N
1722	518	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:22.921006	2026-02-23 16:58:22.921006	\N
1723	518	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:22.923082	2026-02-23 16:58:22.923082	\N
1724	518	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:22.924905	2026-02-23 16:58:22.924905	\N
1725	518	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:22.926679	2026-02-23 16:58:22.926679	\N
1726	518	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:22.928726	2026-02-23 16:58:22.928726	\N
1727	518	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:22.933173	2026-02-23 16:58:22.933173	\N
1728	518	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:22.935523	2026-02-23 16:58:22.935523	\N
1729	518	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:22.937947	2026-02-23 16:58:22.937947	\N
1730	518	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:22.940059	2026-02-23 16:58:22.940059	\N
1731	519	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.941946	2026-02-23 16:58:22.941946	\N
1732	519	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.943709	2026-02-23 16:58:22.943709	\N
1733	519	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.947473	2026-02-23 16:58:22.947473	\N
1734	519	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:22.950609	2026-02-23 16:58:22.950609	\N
1735	519	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:22.952865	2026-02-23 16:58:22.952865	\N
1736	519	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:22.954937	2026-02-23 16:58:22.954937	\N
1737	519	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:22.956659	2026-02-23 16:58:22.956659	\N
1738	519	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:22.9585	2026-02-23 16:58:22.9585	\N
1739	519	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:22.960305	2026-02-23 16:58:22.960305	\N
1740	519	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:22.962571	2026-02-23 16:58:22.962571	\N
1741	519	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:22.965455	2026-02-23 16:58:22.965455	\N
1742	519	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:22.967386	2026-02-23 16:58:22.967386	\N
1743	520	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.969319	2026-02-23 16:58:22.969319	\N
1744	520	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.971278	2026-02-23 16:58:22.971278	\N
1745	520	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.97324	2026-02-23 16:58:22.97324	\N
1746	520	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:22.975684	2026-02-23 16:58:22.975684	\N
1747	520	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:22.977479	2026-02-23 16:58:22.977479	\N
1748	520	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:22.980359	2026-02-23 16:58:22.980359	\N
1749	520	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:22.982622	2026-02-23 16:58:22.982622	\N
1750	520	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:22.98531	2026-02-23 16:58:22.98531	\N
1751	520	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:22.987127	2026-02-23 16:58:22.987127	\N
1752	520	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:22.988805	2026-02-23 16:58:22.988805	\N
1753	520	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:22.990742	2026-02-23 16:58:22.990742	\N
1754	520	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:22.99265	2026-02-23 16:58:22.99265	\N
1755	521	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.99515	2026-02-23 16:58:22.99515	\N
1756	521	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.998955	2026-02-23 16:58:22.998955	\N
1757	521	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.001474	2026-02-23 16:58:23.001474	\N
1758	521	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.005365	2026-02-23 16:58:23.005365	\N
1759	521	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.008943	2026-02-23 16:58:23.008943	\N
1760	521	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.012837	2026-02-23 16:58:23.012837	\N
1761	521	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.017198	2026-02-23 16:58:23.017198	\N
1762	521	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.019852	2026-02-23 16:58:23.019852	\N
1763	521	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.022308	2026-02-23 16:58:23.022308	\N
1764	521	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.024325	2026-02-23 16:58:23.024325	\N
1765	521	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.026227	2026-02-23 16:58:23.026227	\N
1766	521	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.027981	2026-02-23 16:58:23.027981	\N
1767	522	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.031154	2026-02-23 16:58:23.031154	\N
1768	522	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.033188	2026-02-23 16:58:23.033188	\N
1769	522	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.034926	2026-02-23 16:58:23.034926	\N
1770	522	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.036753	2026-02-23 16:58:23.036753	\N
1771	522	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.038509	2026-02-23 16:58:23.038509	\N
1772	522	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.040164	2026-02-23 16:58:23.040164	\N
1773	522	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.042196	2026-02-23 16:58:23.042196	\N
1774	522	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.043945	2026-02-23 16:58:23.043945	\N
1775	522	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.046426	2026-02-23 16:58:23.046426	\N
1776	522	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.048773	2026-02-23 16:58:23.048773	\N
1777	522	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.050605	2026-02-23 16:58:23.050605	\N
1778	522	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.052481	2026-02-23 16:58:23.052481	\N
1779	523	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.05421	2026-02-23 16:58:23.05421	\N
1780	523	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.055857	2026-02-23 16:58:23.055857	\N
1781	523	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.057834	2026-02-23 16:58:23.057834	\N
1782	523	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.059902	2026-02-23 16:58:23.059902	\N
1783	523	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.063502	2026-02-23 16:58:23.063502	\N
1784	523	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.065931	2026-02-23 16:58:23.065931	\N
1785	523	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.071459	2026-02-23 16:58:23.071459	\N
1786	523	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.073687	2026-02-23 16:58:23.073687	\N
1787	523	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.075606	2026-02-23 16:58:23.075606	\N
1788	523	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.077766	2026-02-23 16:58:23.077766	\N
1789	523	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.081103	2026-02-23 16:58:23.081103	\N
1790	523	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.083275	2026-02-23 16:58:23.083275	\N
1791	524	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.085102	2026-02-23 16:58:23.085102	\N
1792	524	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.087176	2026-02-23 16:58:23.087176	\N
1793	524	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.089279	2026-02-23 16:58:23.089279	\N
1794	524	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.091073	2026-02-23 16:58:23.091073	\N
1795	524	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.092924	2026-02-23 16:58:23.092924	\N
1796	524	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.094664	2026-02-23 16:58:23.094664	\N
1797	524	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.097742	2026-02-23 16:58:23.097742	\N
1798	524	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.0997	2026-02-23 16:58:23.0997	\N
1799	524	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.101421	2026-02-23 16:58:23.101421	\N
1800	524	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.103327	2026-02-23 16:58:23.103327	\N
1801	524	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.105076	2026-02-23 16:58:23.105076	\N
1802	524	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.107153	2026-02-23 16:58:23.107153	\N
1803	525	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.108889	2026-02-23 16:58:23.108889	\N
1804	525	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.110584	2026-02-23 16:58:23.110584	\N
1805	525	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.113544	2026-02-23 16:58:23.113544	\N
1806	525	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.115611	2026-02-23 16:58:23.115611	\N
1807	525	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.117527	2026-02-23 16:58:23.117527	\N
1808	525	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.119301	2026-02-23 16:58:23.119301	\N
1809	525	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.120959	2026-02-23 16:58:23.120959	\N
1810	525	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.122813	2026-02-23 16:58:23.122813	\N
1811	525	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.124473	2026-02-23 16:58:23.124473	\N
1812	525	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.126105	2026-02-23 16:58:23.126105	\N
1813	525	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.127874	2026-02-23 16:58:23.127874	\N
1814	525	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.130807	2026-02-23 16:58:23.130807	\N
1815	526	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.132856	2026-02-23 16:58:23.132856	\N
1816	526	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.134551	2026-02-23 16:58:23.134551	\N
1817	526	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.136174	2026-02-23 16:58:23.136174	\N
1818	526	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.137977	2026-02-23 16:58:23.137977	\N
1819	526	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.139727	2026-02-23 16:58:23.139727	\N
1820	526	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.141395	2026-02-23 16:58:23.141395	\N
1821	526	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.143122	2026-02-23 16:58:23.143122	\N
1822	526	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.144841	2026-02-23 16:58:23.144841	\N
1823	526	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.147937	2026-02-23 16:58:23.147937	\N
1824	526	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.149743	2026-02-23 16:58:23.149743	\N
1825	526	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.151446	2026-02-23 16:58:23.151446	\N
1826	526	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.153428	2026-02-23 16:58:23.153428	\N
1827	527	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.155239	2026-02-23 16:58:23.155239	\N
1828	527	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.156919	2026-02-23 16:58:23.156919	\N
1829	527	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.159054	2026-02-23 16:58:23.159054	\N
1830	527	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.160896	2026-02-23 16:58:23.160896	\N
1831	527	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.164732	2026-02-23 16:58:23.164732	\N
1832	527	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.166717	2026-02-23 16:58:23.166717	\N
1833	527	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.168536	2026-02-23 16:58:23.168536	\N
1834	527	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.170222	2026-02-23 16:58:23.170222	\N
1835	527	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.171871	2026-02-23 16:58:23.171871	\N
1836	527	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.173734	2026-02-23 16:58:23.173734	\N
1837	527	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.175595	2026-02-23 16:58:23.175595	\N
1838	527	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.177353	2026-02-23 16:58:23.177353	\N
1839	528	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.180158	2026-02-23 16:58:23.180158	\N
1840	528	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.182364	2026-02-23 16:58:23.182364	\N
1841	528	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.184234	2026-02-23 16:58:23.184234	\N
1842	528	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.185941	2026-02-23 16:58:23.185941	\N
1843	528	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.187632	2026-02-23 16:58:23.187632	\N
1844	528	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.189369	2026-02-23 16:58:23.189369	\N
1845	528	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.190999	2026-02-23 16:58:23.190999	\N
1846	528	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.19284	2026-02-23 16:58:23.19284	\N
1847	528	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.19462	2026-02-23 16:58:23.19462	\N
1848	528	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.197654	2026-02-23 16:58:23.197654	\N
1849	528	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.199903	2026-02-23 16:58:23.199903	\N
1850	528	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.201741	2026-02-23 16:58:23.201741	\N
1851	529	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.203566	2026-02-23 16:58:23.203566	\N
1852	529	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.205315	2026-02-23 16:58:23.205315	\N
1853	529	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.206975	2026-02-23 16:58:23.206975	\N
1854	529	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.208751	2026-02-23 16:58:23.208751	\N
1855	529	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.210439	2026-02-23 16:58:23.210439	\N
1856	529	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.212949	2026-02-23 16:58:23.212949	\N
1857	529	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.215494	2026-02-23 16:58:23.215494	\N
1858	529	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.217278	2026-02-23 16:58:23.217278	\N
1859	529	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.219088	2026-02-23 16:58:23.219088	\N
1860	529	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.22076	2026-02-23 16:58:23.22076	\N
1861	529	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.222509	2026-02-23 16:58:23.222509	\N
1862	529	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.224378	2026-02-23 16:58:23.224378	\N
1863	530	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.226057	2026-02-23 16:58:23.226057	\N
1864	530	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.227927	2026-02-23 16:58:23.227927	\N
1865	530	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.230964	2026-02-23 16:58:23.230964	\N
1866	530	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.233092	2026-02-23 16:58:23.233092	\N
1867	530	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.234926	2026-02-23 16:58:23.234926	\N
1868	530	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.236584	2026-02-23 16:58:23.236584	\N
1869	530	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.238525	2026-02-23 16:58:23.238525	\N
1870	530	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.24029	2026-02-23 16:58:23.24029	\N
1871	530	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.24196	2026-02-23 16:58:23.24196	\N
1872	530	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.243761	2026-02-23 16:58:23.243761	\N
1873	530	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.246024	2026-02-23 16:58:23.246024	\N
1874	530	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.2489	2026-02-23 16:58:23.2489	\N
1875	531	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.250692	2026-02-23 16:58:23.250692	\N
1876	531	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.252473	2026-02-23 16:58:23.252473	\N
1877	531	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.254277	2026-02-23 16:58:23.254277	\N
1878	531	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.255959	2026-02-23 16:58:23.255959	\N
1879	531	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.257791	2026-02-23 16:58:23.257791	\N
1880	531	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.259634	2026-02-23 16:58:23.259634	\N
1881	531	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.261739	2026-02-23 16:58:23.261739	\N
1882	531	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.265079	2026-02-23 16:58:23.265079	\N
1883	531	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.267775	2026-02-23 16:58:23.267775	\N
1884	531	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.269895	2026-02-23 16:58:23.269895	\N
1885	531	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.274275	2026-02-23 16:58:23.274275	\N
1886	531	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.276481	2026-02-23 16:58:23.276481	\N
1887	532	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.278406	2026-02-23 16:58:23.278406	\N
1888	532	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.282143	2026-02-23 16:58:23.282143	\N
1889	532	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.28414	2026-02-23 16:58:23.28414	\N
1890	532	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.286175	2026-02-23 16:58:23.286175	\N
1891	532	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.288147	2026-02-23 16:58:23.288147	\N
1892	532	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.28999	2026-02-23 16:58:23.28999	\N
1893	532	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.292447	2026-02-23 16:58:23.292447	\N
1894	532	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.294244	2026-02-23 16:58:23.294244	\N
1895	532	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.297508	2026-02-23 16:58:23.297508	\N
1896	532	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.299751	2026-02-23 16:58:23.299751	\N
1897	532	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.301669	2026-02-23 16:58:23.301669	\N
1898	532	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.303454	2026-02-23 16:58:23.303454	\N
1899	533	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.305123	2026-02-23 16:58:23.305123	\N
1900	533	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.306938	2026-02-23 16:58:23.306938	\N
1901	533	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.308623	2026-02-23 16:58:23.308623	\N
1902	533	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.310241	2026-02-23 16:58:23.310241	\N
1903	533	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.312621	2026-02-23 16:58:23.312621	\N
1904	533	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.315194	2026-02-23 16:58:23.315194	\N
1905	533	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.31736	2026-02-23 16:58:23.31736	\N
1906	533	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.319277	2026-02-23 16:58:23.319277	\N
1907	533	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.321444	2026-02-23 16:58:23.321444	\N
1908	533	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.323249	2026-02-23 16:58:23.323249	\N
1909	533	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.324935	2026-02-23 16:58:23.324935	\N
1910	533	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.326729	2026-02-23 16:58:23.326729	\N
1911	534	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.328406	2026-02-23 16:58:23.328406	\N
1912	534	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.331426	2026-02-23 16:58:23.331426	\N
1913	534	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.333257	2026-02-23 16:58:23.333257	\N
1914	534	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.334899	2026-02-23 16:58:23.334899	\N
1915	534	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.336731	2026-02-23 16:58:23.336731	\N
1916	534	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.338462	2026-02-23 16:58:23.338462	\N
1917	534	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.340137	2026-02-23 16:58:23.340137	\N
1918	534	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.341997	2026-02-23 16:58:23.341997	\N
1919	534	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.343673	2026-02-23 16:58:23.343673	\N
1920	534	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.345713	2026-02-23 16:58:23.345713	\N
1921	534	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.348748	2026-02-23 16:58:23.348748	\N
1922	534	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.350551	2026-02-23 16:58:23.350551	\N
1923	535	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.352412	2026-02-23 16:58:23.352412	\N
1924	535	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.354171	2026-02-23 16:58:23.354171	\N
1925	535	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.355857	2026-02-23 16:58:23.355857	\N
1926	535	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.357613	2026-02-23 16:58:23.357613	\N
1927	535	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.359277	2026-02-23 16:58:23.359277	\N
1928	535	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.360899	2026-02-23 16:58:23.360899	\N
1929	535	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.363763	2026-02-23 16:58:23.363763	\N
1930	535	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.365787	2026-02-23 16:58:23.365787	\N
1931	535	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.367653	2026-02-23 16:58:23.367653	\N
1932	535	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.369351	2026-02-23 16:58:23.369351	\N
1933	535	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.371018	2026-02-23 16:58:23.371018	\N
1934	535	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.372916	2026-02-23 16:58:23.372916	\N
1935	536	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.374646	2026-02-23 16:58:23.374646	\N
1936	536	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.376291	2026-02-23 16:58:23.376291	\N
1937	536	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.37806	2026-02-23 16:58:23.37806	\N
1938	536	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.380891	2026-02-23 16:58:23.380891	\N
1939	536	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.382908	2026-02-23 16:58:23.382908	\N
1940	536	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.38461	2026-02-23 16:58:23.38461	\N
1941	536	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.386272	2026-02-23 16:58:23.386272	\N
1942	536	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.388132	2026-02-23 16:58:23.388132	\N
1943	536	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.389829	2026-02-23 16:58:23.389829	\N
1944	536	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.391606	2026-02-23 16:58:23.391606	\N
1945	536	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.393386	2026-02-23 16:58:23.393386	\N
1946	536	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.395063	2026-02-23 16:58:23.395063	\N
1947	537	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.398135	2026-02-23 16:58:23.398135	\N
1948	537	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.399997	2026-02-23 16:58:23.399997	\N
1949	537	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.401752	2026-02-23 16:58:23.401752	\N
1950	537	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.403505	2026-02-23 16:58:23.403505	\N
1951	537	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.405169	2026-02-23 16:58:23.405169	\N
1952	537	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.407111	2026-02-23 16:58:23.407111	\N
1953	537	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.408898	2026-02-23 16:58:23.408898	\N
1954	537	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.41056	2026-02-23 16:58:23.41056	\N
1955	537	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.412912	2026-02-23 16:58:23.412912	\N
1956	537	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.415313	2026-02-23 16:58:23.415313	\N
1957	537	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.417278	2026-02-23 16:58:23.417278	\N
1958	537	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.4191	2026-02-23 16:58:23.4191	\N
1959	538	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.420742	2026-02-23 16:58:23.420742	\N
1960	538	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.422522	2026-02-23 16:58:23.422522	\N
1961	538	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.424239	2026-02-23 16:58:23.424239	\N
1962	538	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.425906	2026-02-23 16:58:23.425906	\N
1963	538	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.427832	2026-02-23 16:58:23.427832	\N
1964	538	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.430768	2026-02-23 16:58:23.430768	\N
1965	538	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.432813	2026-02-23 16:58:23.432813	\N
1966	538	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.434585	2026-02-23 16:58:23.434585	\N
1967	538	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.436248	2026-02-23 16:58:23.436248	\N
1968	538	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.438114	2026-02-23 16:58:23.438114	\N
1969	538	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.439943	2026-02-23 16:58:23.439943	\N
1970	538	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.441644	2026-02-23 16:58:23.441644	\N
1971	539	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.443445	2026-02-23 16:58:23.443445	\N
1972	539	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.445284	2026-02-23 16:58:23.445284	\N
1973	539	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.448162	2026-02-23 16:58:23.448162	\N
1974	539	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.450014	2026-02-23 16:58:23.450014	\N
1975	539	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.45169	2026-02-23 16:58:23.45169	\N
1976	539	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.453634	2026-02-23 16:58:23.453634	\N
1977	539	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.455395	2026-02-23 16:58:23.455395	\N
1978	539	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.457051	2026-02-23 16:58:23.457051	\N
1979	539	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.459667	2026-02-23 16:58:23.459667	\N
1980	539	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.463491	2026-02-23 16:58:23.463491	\N
1981	539	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.466911	2026-02-23 16:58:23.466911	\N
1982	539	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.469171	2026-02-23 16:58:23.469171	\N
1983	540	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.471423	2026-02-23 16:58:23.471423	\N
1984	540	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.475834	2026-02-23 16:58:23.475834	\N
1985	540	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.47791	2026-02-23 16:58:23.47791	\N
1986	540	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.481339	2026-02-23 16:58:23.481339	\N
1987	540	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.483328	2026-02-23 16:58:23.483328	\N
1988	540	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.485378	2026-02-23 16:58:23.485378	\N
1989	540	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.487219	2026-02-23 16:58:23.487219	\N
1990	540	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.489019	2026-02-23 16:58:23.489019	\N
1991	540	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.491263	2026-02-23 16:58:23.491263	\N
1992	540	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.493307	2026-02-23 16:58:23.493307	\N
1993	540	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.495644	2026-02-23 16:58:23.495644	\N
1994	540	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.498353	2026-02-23 16:58:23.498353	\N
1995	541	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.500305	2026-02-23 16:58:23.500305	\N
1996	541	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.502064	2026-02-23 16:58:23.502064	\N
1997	541	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.503684	2026-02-23 16:58:23.503684	\N
1998	541	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.505451	2026-02-23 16:58:23.505451	\N
1999	541	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.507231	2026-02-23 16:58:23.507231	\N
2000	541	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.508874	2026-02-23 16:58:23.508874	\N
2001	541	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.510715	2026-02-23 16:58:23.510715	\N
2002	541	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.513468	2026-02-23 16:58:23.513468	\N
2003	541	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.515814	2026-02-23 16:58:23.515814	\N
2004	541	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.517764	2026-02-23 16:58:23.517764	\N
2005	541	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.519619	2026-02-23 16:58:23.519619	\N
2006	541	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.521506	2026-02-23 16:58:23.521506	\N
2007	542	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.523264	2026-02-23 16:58:23.523264	\N
2008	542	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.524898	2026-02-23 16:58:23.524898	\N
2009	542	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.526672	2026-02-23 16:58:23.526672	\N
2010	542	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.528367	2026-02-23 16:58:23.528367	\N
2011	542	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.53185	2026-02-23 16:58:23.53185	\N
2012	542	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.533604	2026-02-23 16:58:23.533604	\N
2013	542	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.535371	2026-02-23 16:58:23.535371	\N
2014	542	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.537214	2026-02-23 16:58:23.537214	\N
2015	542	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.538915	2026-02-23 16:58:23.538915	\N
2016	542	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.540679	2026-02-23 16:58:23.540679	\N
2017	542	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.54244	2026-02-23 16:58:23.54244	\N
2018	542	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.544142	2026-02-23 16:58:23.544142	\N
2019	543	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.547337	2026-02-23 16:58:23.547337	\N
2020	543	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.549487	2026-02-23 16:58:23.549487	\N
2021	543	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.55368	2026-02-23 16:58:23.55368	\N
2022	543	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.55544	2026-02-23 16:58:23.55544	\N
2023	543	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.557117	2026-02-23 16:58:23.557117	\N
2024	543	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.558873	2026-02-23 16:58:23.558873	\N
2025	543	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.560525	2026-02-23 16:58:23.560525	\N
2026	543	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.562804	2026-02-23 16:58:23.562804	\N
2027	543	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.565651	2026-02-23 16:58:23.565651	\N
2028	543	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.567458	2026-02-23 16:58:23.567458	\N
2029	543	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.569323	2026-02-23 16:58:23.569323	\N
2030	543	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.571134	2026-02-23 16:58:23.571134	\N
2031	544	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.572797	2026-02-23 16:58:23.572797	\N
2032	544	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.574569	2026-02-23 16:58:23.574569	\N
2033	544	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.576291	2026-02-23 16:58:23.576291	\N
2034	544	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.577961	2026-02-23 16:58:23.577961	\N
2035	544	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.581178	2026-02-23 16:58:23.581178	\N
2036	544	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.58302	2026-02-23 16:58:23.58302	\N
2037	544	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.5849	2026-02-23 16:58:23.5849	\N
2038	544	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.586594	2026-02-23 16:58:23.586594	\N
2039	544	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.58826	2026-02-23 16:58:23.58826	\N
2040	544	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.590119	2026-02-23 16:58:23.590119	\N
2041	544	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.591894	2026-02-23 16:58:23.591894	\N
2042	544	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.593679	2026-02-23 16:58:23.593679	\N
2043	545	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.596288	2026-02-23 16:58:23.596288	\N
2044	545	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.598502	2026-02-23 16:58:23.598502	\N
2045	545	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.600411	2026-02-23 16:58:23.600411	\N
2046	545	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.602129	2026-02-23 16:58:23.602129	\N
2047	545	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.604003	2026-02-23 16:58:23.604003	\N
2048	545	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.605753	2026-02-23 16:58:23.605753	\N
2049	545	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.607409	2026-02-23 16:58:23.607409	\N
2050	545	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.609253	2026-02-23 16:58:23.609253	\N
2051	545	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.611074	2026-02-23 16:58:23.611074	\N
2052	545	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.613997	2026-02-23 16:58:23.613997	\N
2053	545	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.616136	2026-02-23 16:58:23.616136	\N
2054	545	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.617873	2026-02-23 16:58:23.617873	\N
2055	546	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.619585	2026-02-23 16:58:23.619585	\N
2056	546	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.621325	2026-02-23 16:58:23.621325	\N
2057	546	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.62301	2026-02-23 16:58:23.62301	\N
2058	546	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.624789	2026-02-23 16:58:23.624789	\N
2059	546	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.626597	2026-02-23 16:58:23.626597	\N
2060	546	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.628293	2026-02-23 16:58:23.628293	\N
2061	546	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.631493	2026-02-23 16:58:23.631493	\N
2062	546	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.633273	2026-02-23 16:58:23.633273	\N
2063	546	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.635285	2026-02-23 16:58:23.635285	\N
2064	546	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.637128	2026-02-23 16:58:23.637128	\N
2065	546	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.63886	2026-02-23 16:58:23.63886	\N
2066	546	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.640771	2026-02-23 16:58:23.640771	\N
2067	547	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.64248	2026-02-23 16:58:23.64248	\N
2068	547	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.644124	2026-02-23 16:58:23.644124	\N
2069	547	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.64705	2026-02-23 16:58:23.64705	\N
2070	547	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.6491	2026-02-23 16:58:23.6491	\N
2071	547	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.651019	2026-02-23 16:58:23.651019	\N
2072	547	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.652739	2026-02-23 16:58:23.652739	\N
2073	547	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.654586	2026-02-23 16:58:23.654586	\N
2074	547	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.656353	2026-02-23 16:58:23.656353	\N
2075	547	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.658057	2026-02-23 16:58:23.658057	\N
2076	547	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.659995	2026-02-23 16:58:23.659995	\N
2077	547	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.663005	2026-02-23 16:58:23.663005	\N
2078	547	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.666065	2026-02-23 16:58:23.666065	\N
2079	548	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.668329	2026-02-23 16:58:23.668329	\N
2080	548	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.670297	2026-02-23 16:58:23.670297	\N
2081	548	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.675365	2026-02-23 16:58:23.675365	\N
2082	548	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.67745	2026-02-23 16:58:23.67745	\N
2083	548	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.680846	2026-02-23 16:58:23.680846	\N
2084	548	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.683232	2026-02-23 16:58:23.683232	\N
2085	548	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.685146	2026-02-23 16:58:23.685146	\N
2086	548	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.687233	2026-02-23 16:58:23.687233	\N
2087	548	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.689042	2026-02-23 16:58:23.689042	\N
2088	548	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.691074	2026-02-23 16:58:23.691074	\N
2089	548	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.693277	2026-02-23 16:58:23.693277	\N
2090	548	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.69518	2026-02-23 16:58:23.69518	\N
2091	549	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.698081	2026-02-23 16:58:23.698081	\N
2092	549	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.699955	2026-02-23 16:58:23.699955	\N
2093	549	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.701809	2026-02-23 16:58:23.701809	\N
2094	549	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.703493	2026-02-23 16:58:23.703493	\N
2095	549	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.705131	2026-02-23 16:58:23.705131	\N
2096	549	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.706887	2026-02-23 16:58:23.706887	\N
2097	549	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.708559	2026-02-23 16:58:23.708559	\N
2098	549	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.71021	2026-02-23 16:58:23.71021	\N
2099	549	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.712888	2026-02-23 16:58:23.712888	\N
2100	549	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.715244	2026-02-23 16:58:23.715244	\N
2101	549	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.717191	2026-02-23 16:58:23.717191	\N
2102	549	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.718924	2026-02-23 16:58:23.718924	\N
2103	550	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.720713	2026-02-23 16:58:23.720713	\N
2104	550	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.722465	2026-02-23 16:58:23.722465	\N
2105	550	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.724147	2026-02-23 16:58:23.724147	\N
2106	550	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.725933	2026-02-23 16:58:23.725933	\N
2107	550	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.727787	2026-02-23 16:58:23.727787	\N
2108	550	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.730618	2026-02-23 16:58:23.730618	\N
2109	550	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.732831	2026-02-23 16:58:23.732831	\N
2110	550	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.734584	2026-02-23 16:58:23.734584	\N
2111	550	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.736482	2026-02-23 16:58:23.736482	\N
2112	550	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.738202	2026-02-23 16:58:23.738202	\N
2113	550	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.739879	2026-02-23 16:58:23.739879	\N
2114	550	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.741653	2026-02-23 16:58:23.741653	\N
2115	551	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.743299	2026-02-23 16:58:23.743299	\N
2116	551	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.745078	2026-02-23 16:58:23.745078	\N
2117	551	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.748375	2026-02-23 16:58:23.748375	\N
2118	551	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.750202	2026-02-23 16:58:23.750202	\N
2119	551	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.752033	2026-02-23 16:58:23.752033	\N
2120	551	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.753686	2026-02-23 16:58:23.753686	\N
2121	551	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.755326	2026-02-23 16:58:23.755326	\N
2122	551	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.757111	2026-02-23 16:58:23.757111	\N
2123	551	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.758786	2026-02-23 16:58:23.758786	\N
2124	551	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.760512	2026-02-23 16:58:23.760512	\N
2125	551	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.76283	2026-02-23 16:58:23.76283	\N
2126	551	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.765389	2026-02-23 16:58:23.765389	\N
2127	552	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.767468	2026-02-23 16:58:23.767468	\N
2128	552	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.769212	2026-02-23 16:58:23.769212	\N
2129	552	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.771114	2026-02-23 16:58:23.771114	\N
2130	552	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.772905	2026-02-23 16:58:23.772905	\N
2131	552	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.774687	2026-02-23 16:58:23.774687	\N
2132	552	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.776515	2026-02-23 16:58:23.776515	\N
2133	552	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.778257	2026-02-23 16:58:23.778257	\N
2134	552	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.781852	2026-02-23 16:58:23.781852	\N
2135	552	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.784476	2026-02-23 16:58:23.784476	\N
2136	552	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.786387	2026-02-23 16:58:23.786387	\N
2137	552	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.78822	2026-02-23 16:58:23.78822	\N
2138	552	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.789936	2026-02-23 16:58:23.789936	\N
2139	553	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.791954	2026-02-23 16:58:23.791954	\N
2140	553	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.793629	2026-02-23 16:58:23.793629	\N
2141	553	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.795292	2026-02-23 16:58:23.795292	\N
2142	553	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.798273	2026-02-23 16:58:23.798273	\N
2143	553	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.800131	2026-02-23 16:58:23.800131	\N
2144	553	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.801985	2026-02-23 16:58:23.801985	\N
2145	553	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.803656	2026-02-23 16:58:23.803656	\N
2146	553	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.805289	2026-02-23 16:58:23.805289	\N
2147	553	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.807136	2026-02-23 16:58:23.807136	\N
2148	553	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.808869	2026-02-23 16:58:23.808869	\N
2149	553	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.810765	2026-02-23 16:58:23.810765	\N
2150	553	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.814669	2026-02-23 16:58:23.814669	\N
2151	554	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.817675	2026-02-23 16:58:23.817675	\N
2152	554	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.820502	2026-02-23 16:58:23.820502	\N
2153	554	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.823567	2026-02-23 16:58:23.823567	\N
2154	554	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.826448	2026-02-23 16:58:23.826448	\N
2155	554	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.830448	2026-02-23 16:58:23.830448	\N
2156	554	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.833407	2026-02-23 16:58:23.833407	\N
2157	554	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.835482	2026-02-23 16:58:23.835482	\N
2158	554	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.837547	2026-02-23 16:58:23.837547	\N
2159	554	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.840858	2026-02-23 16:58:23.840858	\N
2160	554	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.843365	2026-02-23 16:58:23.843365	\N
2161	554	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.845629	2026-02-23 16:58:23.845629	\N
2162	554	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.848343	2026-02-23 16:58:23.848343	\N
2163	555	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.850252	2026-02-23 16:58:23.850252	\N
2164	555	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.852084	2026-02-23 16:58:23.852084	\N
2165	555	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.853741	2026-02-23 16:58:23.853741	\N
2166	555	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.855636	2026-02-23 16:58:23.855636	\N
2167	555	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.857389	2026-02-23 16:58:23.857389	\N
2168	555	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.859059	2026-02-23 16:58:23.859059	\N
2169	555	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.86091	2026-02-23 16:58:23.86091	\N
2170	555	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.864169	2026-02-23 16:58:23.864169	\N
2171	555	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.866583	2026-02-23 16:58:23.866583	\N
2172	555	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.868832	2026-02-23 16:58:23.868832	\N
2173	555	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.870799	2026-02-23 16:58:23.870799	\N
2174	555	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.875413	2026-02-23 16:58:23.875413	\N
2175	556	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.87746	2026-02-23 16:58:23.87746	\N
2176	556	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.881212	2026-02-23 16:58:23.881212	\N
2177	556	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.883316	2026-02-23 16:58:23.883316	\N
2178	556	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.885415	2026-02-23 16:58:23.885415	\N
2179	556	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.887253	2026-02-23 16:58:23.887253	\N
2180	556	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.889053	2026-02-23 16:58:23.889053	\N
2181	556	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.891019	2026-02-23 16:58:23.891019	\N
2182	556	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.892979	2026-02-23 16:58:23.892979	\N
2183	556	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.895038	2026-02-23 16:58:23.895038	\N
2184	556	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.897909	2026-02-23 16:58:23.897909	\N
2185	556	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.899816	2026-02-23 16:58:23.899816	\N
2186	556	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.901715	2026-02-23 16:58:23.901715	\N
2187	557	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.903387	2026-02-23 16:58:23.903387	\N
2188	557	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.905147	2026-02-23 16:58:23.905147	\N
2189	557	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.90685	2026-02-23 16:58:23.90685	\N
2190	557	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.908456	2026-02-23 16:58:23.908456	\N
2191	557	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.910201	2026-02-23 16:58:23.910201	\N
2192	557	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.912169	2026-02-23 16:58:23.912169	\N
2193	557	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.915018	2026-02-23 16:58:23.915018	\N
2194	557	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.91681	2026-02-23 16:58:23.91681	\N
2195	557	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.918505	2026-02-23 16:58:23.918505	\N
2196	557	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.920358	2026-02-23 16:58:23.920358	\N
2197	557	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.92219	2026-02-23 16:58:23.92219	\N
2198	557	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.923887	2026-02-23 16:58:23.923887	\N
2199	558	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.925647	2026-02-23 16:58:23.925647	\N
2200	558	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.92732	2026-02-23 16:58:23.92732	\N
2201	558	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.929607	2026-02-23 16:58:23.929607	\N
2202	558	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.932056	2026-02-23 16:58:23.932056	\N
2203	558	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.933747	2026-02-23 16:58:23.933747	\N
2204	558	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.935558	2026-02-23 16:58:23.935558	\N
2205	558	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.93727	2026-02-23 16:58:23.93727	\N
2206	558	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.938925	2026-02-23 16:58:23.938925	\N
2207	558	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.940926	2026-02-23 16:58:23.940926	\N
2208	558	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.942717	2026-02-23 16:58:23.942717	\N
2209	558	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.944525	2026-02-23 16:58:23.944525	\N
2210	558	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.948087	2026-02-23 16:58:23.948087	\N
2211	559	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.950109	2026-02-23 16:58:23.950109	\N
2212	559	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.951894	2026-02-23 16:58:23.951894	\N
2213	559	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.953526	2026-02-23 16:58:23.953526	\N
2214	559	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.955462	2026-02-23 16:58:23.955462	\N
2215	559	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.957216	2026-02-23 16:58:23.957216	\N
2216	559	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.958864	2026-02-23 16:58:23.958864	\N
2217	559	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.960651	2026-02-23 16:58:23.960651	\N
2218	559	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.963063	2026-02-23 16:58:23.963063	\N
2219	559	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.96551	2026-02-23 16:58:23.96551	\N
2220	559	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.967259	2026-02-23 16:58:23.967259	\N
2221	559	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.968985	2026-02-23 16:58:23.968985	\N
2222	559	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.970823	2026-02-23 16:58:23.970823	\N
2223	560	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.97255	2026-02-23 16:58:23.97255	\N
2224	560	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.97419	2026-02-23 16:58:23.97419	\N
2225	560	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.976265	2026-02-23 16:58:23.976265	\N
2226	560	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:23.977972	2026-02-23 16:58:23.977972	\N
2227	560	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:23.981464	2026-02-23 16:58:23.981464	\N
2228	560	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:23.983569	2026-02-23 16:58:23.983569	\N
2229	560	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:23.985745	2026-02-23 16:58:23.985745	\N
2230	560	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:23.98762	2026-02-23 16:58:23.98762	\N
2231	560	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:23.989299	2026-02-23 16:58:23.989299	\N
2232	560	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:23.991101	2026-02-23 16:58:23.991101	\N
2233	560	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:23.992815	2026-02-23 16:58:23.992815	\N
2234	560	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:23.994591	2026-02-23 16:58:23.994591	\N
2235	561	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.997664	2026-02-23 16:58:23.997664	\N
2236	561	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.999657	2026-02-23 16:58:23.999657	\N
2237	561	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.001415	2026-02-23 16:58:24.001415	\N
2238	561	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:24.003092	2026-02-23 16:58:24.003092	\N
2239	561	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:24.004928	2026-02-23 16:58:24.004928	\N
2240	561	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:24.006689	2026-02-23 16:58:24.006689	\N
2241	561	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:24.008517	2026-02-23 16:58:24.008517	\N
2242	561	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:24.010813	2026-02-23 16:58:24.010813	\N
2243	561	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:24.014024	2026-02-23 16:58:24.014024	\N
2244	561	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:24.016042	2026-02-23 16:58:24.016042	\N
2245	561	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:24.017744	2026-02-23 16:58:24.017744	\N
2246	561	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:24.019496	2026-02-23 16:58:24.019496	\N
2247	562	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.021225	2026-02-23 16:58:24.021225	\N
2248	562	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.022868	2026-02-23 16:58:24.022868	\N
2249	562	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.024587	2026-02-23 16:58:24.024587	\N
2250	562	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:24.026347	2026-02-23 16:58:24.026347	\N
2251	562	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:24.027995	2026-02-23 16:58:24.027995	\N
2252	562	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:24.031204	2026-02-23 16:58:24.031204	\N
2253	562	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:24.033077	2026-02-23 16:58:24.033077	\N
2254	562	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:24.03492	2026-02-23 16:58:24.03492	\N
2255	562	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:24.036668	2026-02-23 16:58:24.036668	\N
2256	562	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:24.038311	2026-02-23 16:58:24.038311	\N
2257	562	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:24.040097	2026-02-23 16:58:24.040097	\N
2258	562	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:24.041858	2026-02-23 16:58:24.041858	\N
2259	563	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.043498	2026-02-23 16:58:24.043498	\N
2260	563	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.045513	2026-02-23 16:58:24.045513	\N
2261	563	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.04803	2026-02-23 16:58:24.04803	\N
2262	563	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:24.049998	2026-02-23 16:58:24.049998	\N
2263	563	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:24.051825	2026-02-23 16:58:24.051825	\N
2264	563	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:24.053503	2026-02-23 16:58:24.053503	\N
2265	563	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:24.05543	2026-02-23 16:58:24.05543	\N
2266	563	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:24.05714	2026-02-23 16:58:24.05714	\N
2267	563	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:24.058779	2026-02-23 16:58:24.058779	\N
2268	563	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:24.06068	2026-02-23 16:58:24.06068	\N
2269	563	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:24.063623	2026-02-23 16:58:24.063623	\N
2270	563	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:24.066414	2026-02-23 16:58:24.066414	\N
2271	564	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.068667	2026-02-23 16:58:24.068667	\N
2272	564	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.070801	2026-02-23 16:58:24.070801	\N
2273	564	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.077523	2026-02-23 16:58:24.077523	\N
2274	564	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:24.08227	2026-02-23 16:58:24.08227	\N
2275	564	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:24.084506	2026-02-23 16:58:24.084506	\N
2276	564	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:24.086337	2026-02-23 16:58:24.086337	\N
2277	564	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:24.088362	2026-02-23 16:58:24.088362	\N
2278	564	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:24.090202	2026-02-23 16:58:24.090202	\N
2279	564	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:24.092132	2026-02-23 16:58:24.092132	\N
2280	564	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:24.093945	2026-02-23 16:58:24.093945	\N
2281	564	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:24.097131	2026-02-23 16:58:24.097131	\N
2282	564	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:24.099824	2026-02-23 16:58:24.099824	\N
2283	565	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.101681	2026-02-23 16:58:24.101681	\N
2284	565	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.103437	2026-02-23 16:58:24.103437	\N
2285	565	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.1052	2026-02-23 16:58:24.1052	\N
2286	565	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:24.107147	2026-02-23 16:58:24.107147	\N
2287	565	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:24.108858	2026-02-23 16:58:24.108858	\N
2288	565	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:24.110535	2026-02-23 16:58:24.110535	\N
2289	565	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:24.113114	2026-02-23 16:58:24.113114	\N
2290	565	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:24.115395	2026-02-23 16:58:24.115395	\N
2291	565	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:24.117327	2026-02-23 16:58:24.117327	\N
2292	565	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:24.119106	2026-02-23 16:58:24.119106	\N
2293	565	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:24.120817	2026-02-23 16:58:24.120817	\N
2294	565	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:24.122588	2026-02-23 16:58:24.122588	\N
2295	566	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.124295	2026-02-23 16:58:24.124295	\N
2296	566	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.125923	2026-02-23 16:58:24.125923	\N
2297	566	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.127857	2026-02-23 16:58:24.127857	\N
2298	566	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:24.131023	2026-02-23 16:58:24.131023	\N
2299	566	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:24.133018	2026-02-23 16:58:24.133018	\N
2300	566	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:24.134733	2026-02-23 16:58:24.134733	\N
2301	566	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:24.136454	2026-02-23 16:58:24.136454	\N
2302	566	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:24.138343	2026-02-23 16:58:24.138343	\N
2303	566	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:24.140038	2026-02-23 16:58:24.140038	\N
2304	566	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:24.141845	2026-02-23 16:58:24.141845	\N
2305	566	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:24.143594	2026-02-23 16:58:24.143594	\N
2306	566	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:24.145419	2026-02-23 16:58:24.145419	\N
2307	567	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.148464	2026-02-23 16:58:24.148464	\N
2308	567	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.150243	2026-02-23 16:58:24.150243	\N
2309	567	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.151894	2026-02-23 16:58:24.151894	\N
2310	567	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:24.153802	2026-02-23 16:58:24.153802	\N
2311	567	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:24.155548	2026-02-23 16:58:24.155548	\N
2312	567	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:24.15721	2026-02-23 16:58:24.15721	\N
2313	567	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:24.15896	2026-02-23 16:58:24.15896	\N
2314	567	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:24.16061	2026-02-23 16:58:24.16061	\N
2315	567	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:24.163622	2026-02-23 16:58:24.163622	\N
2316	567	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:24.166138	2026-02-23 16:58:24.166138	\N
2317	567	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:24.167968	2026-02-23 16:58:24.167968	\N
2318	567	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:24.169859	2026-02-23 16:58:24.169859	\N
2319	568	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.171585	2026-02-23 16:58:24.171585	\N
2320	568	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.173231	2026-02-23 16:58:24.173231	\N
2321	568	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.175112	2026-02-23 16:58:24.175112	\N
2322	568	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:24.177103	2026-02-23 16:58:24.177103	\N
2323	568	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:24.179676	2026-02-23 16:58:24.179676	\N
2324	568	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:24.18205	2026-02-23 16:58:24.18205	\N
2325	568	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:24.183816	2026-02-23 16:58:24.183816	\N
2326	568	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:24.185552	2026-02-23 16:58:24.185552	\N
2327	568	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:24.187186	2026-02-23 16:58:24.187186	\N
2328	568	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:24.188968	2026-02-23 16:58:24.188968	\N
2329	568	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:24.190754	2026-02-23 16:58:24.190754	\N
2330	568	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:24.19242	2026-02-23 16:58:24.19242	\N
2331	569	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.194311	2026-02-23 16:58:24.194311	\N
2332	569	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.197106	2026-02-23 16:58:24.197106	\N
2333	569	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.199476	2026-02-23 16:58:24.199476	\N
2334	569	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:24.201226	2026-02-23 16:58:24.201226	\N
2335	569	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:24.20286	2026-02-23 16:58:24.20286	\N
2336	569	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:24.204629	2026-02-23 16:58:24.204629	\N
2337	569	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:24.206304	2026-02-23 16:58:24.206304	\N
2338	569	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:24.20796	2026-02-23 16:58:24.20796	\N
2339	569	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:24.209748	2026-02-23 16:58:24.209748	\N
2340	569	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:24.211424	2026-02-23 16:58:24.211424	\N
2341	569	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:24.214593	2026-02-23 16:58:24.214593	\N
2342	569	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:24.216674	2026-02-23 16:58:24.216674	\N
2343	570	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.21845	2026-02-23 16:58:24.21845	\N
2344	570	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.220239	2026-02-23 16:58:24.220239	\N
2345	570	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.221986	2026-02-23 16:58:24.221986	\N
2346	570	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:24.223698	2026-02-23 16:58:24.223698	\N
2347	570	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:24.225402	2026-02-23 16:58:24.225402	\N
2348	570	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:24.227049	2026-02-23 16:58:24.227049	\N
2349	570	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:24.229523	2026-02-23 16:58:24.229523	\N
2350	570	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:24.231983	2026-02-23 16:58:24.231983	\N
2351	570	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:24.233883	2026-02-23 16:58:24.233883	\N
2352	570	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:24.235681	2026-02-23 16:58:24.235681	\N
2353	570	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:24.237403	2026-02-23 16:58:24.237403	\N
2354	570	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:24.239485	2026-02-23 16:58:24.239485	\N
2355	571	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.241225	2026-02-23 16:58:24.241225	\N
2356	571	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.242875	2026-02-23 16:58:24.242875	\N
2357	571	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.244611	2026-02-23 16:58:24.244611	\N
2358	571	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:24.247447	2026-02-23 16:58:24.247447	\N
2359	571	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:24.249562	2026-02-23 16:58:24.249562	\N
2360	571	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:24.251364	2026-02-23 16:58:24.251364	\N
2361	571	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:24.253056	2026-02-23 16:58:24.253056	\N
2362	571	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:24.254977	2026-02-23 16:58:24.254977	\N
2363	571	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:24.256618	2026-02-23 16:58:24.256618	\N
2364	571	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:24.258244	2026-02-23 16:58:24.258244	\N
2365	571	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:24.26004	2026-02-23 16:58:24.26004	\N
2366	571	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:24.262076	2026-02-23 16:58:24.262076	\N
2367	576	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.265704	2026-02-23 16:58:24.265704	\N
2368	576	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.268221	2026-02-23 16:58:24.268221	\N
2369	576	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.270563	2026-02-23 16:58:24.270563	\N
2370	576	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:24.272403	2026-02-23 16:58:24.272403	\N
2371	576	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:24.276985	2026-02-23 16:58:24.276985	\N
2372	576	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:24.280094	2026-02-23 16:58:24.280094	\N
2373	576	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:24.282585	2026-02-23 16:58:24.282585	\N
2374	576	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:24.284573	2026-02-23 16:58:24.284573	\N
2375	576	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:24.286515	2026-02-23 16:58:24.286515	\N
2376	576	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:24.288319	2026-02-23 16:58:24.288319	\N
2377	576	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:24.290136	2026-02-23 16:58:24.290136	\N
2378	576	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:24.292369	2026-02-23 16:58:24.292369	\N
2379	577	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.294396	2026-02-23 16:58:24.294396	\N
2380	577	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.297872	2026-02-23 16:58:24.297872	\N
2381	577	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.299782	2026-02-23 16:58:24.299782	\N
2382	577	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:24.301549	2026-02-23 16:58:24.301549	\N
2383	577	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:24.303399	2026-02-23 16:58:24.303399	\N
2384	577	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:24.30506	2026-02-23 16:58:24.30506	\N
2385	577	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:24.306787	2026-02-23 16:58:24.306787	\N
2386	577	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:24.308543	2026-02-23 16:58:24.308543	\N
2387	577	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:24.310184	2026-02-23 16:58:24.310184	\N
2388	577	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:24.312294	2026-02-23 16:58:24.312294	\N
2389	577	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:24.315353	2026-02-23 16:58:24.315353	\N
2390	577	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:24.317332	2026-02-23 16:58:24.317332	\N
2391	578	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.319089	2026-02-23 16:58:24.319089	\N
2392	578	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.320734	2026-02-23 16:58:24.320734	\N
2393	578	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.322489	2026-02-23 16:58:24.322489	\N
2394	578	31	4	2026	4000.00	4000.00	pending	0.00	2026-05-01	2026-02-23 16:58:24.324195	2026-02-23 16:58:24.324195	\N
2395	578	31	5	2026	4000.00	4000.00	pending	0.00	2026-06-01	2026-02-23 16:58:24.325823	2026-02-23 16:58:24.325823	\N
2396	578	31	6	2026	4000.00	4000.00	pending	0.00	2026-07-01	2026-02-23 16:58:24.327621	2026-02-23 16:58:24.327621	\N
2397	578	31	7	2026	4000.00	4000.00	pending	0.00	2026-08-01	2026-02-23 16:58:24.330377	2026-02-23 16:58:24.330377	\N
2398	578	31	8	2026	4000.00	4000.00	pending	0.00	2026-09-01	2026-02-23 16:58:24.33261	2026-02-23 16:58:24.33261	\N
2399	578	31	9	2026	4000.00	4000.00	pending	0.00	2026-10-01	2026-02-23 16:58:24.334459	2026-02-23 16:58:24.334459	\N
2400	578	31	10	2026	4000.00	4000.00	pending	0.00	2026-11-01	2026-02-23 16:58:24.33617	2026-02-23 16:58:24.33617	\N
2401	578	31	11	2026	4000.00	4000.00	pending	0.00	2026-12-01	2026-02-23 16:58:24.337959	2026-02-23 16:58:24.337959	\N
2402	578	31	12	2026	4000.00	4000.00	pending	0.00	2027-01-01	2026-02-23 16:58:24.339711	2026-02-23 16:58:24.339711	\N
2403	579	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:23.034035	2026-02-24 14:28:23.034035	\N
2404	579	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:23.131564	2026-02-24 14:28:23.131564	\N
2405	579	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:23.187347	2026-02-24 14:28:23.187347	\N
2406	579	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:23.403489	2026-02-24 14:28:23.403489	\N
2407	579	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:23.497493	2026-02-24 14:28:23.497493	\N
2408	579	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:23.538282	2026-02-24 14:28:23.538282	\N
2409	579	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:23.544554	2026-02-24 14:28:23.544554	\N
2410	579	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:23.547807	2026-02-24 14:28:23.547807	\N
2411	579	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:23.55161	2026-02-24 14:28:23.55161	\N
2412	579	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:23.555823	2026-02-24 14:28:23.555823	\N
2413	579	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:23.561261	2026-02-24 14:28:23.561261	\N
2414	579	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:23.565392	2026-02-24 14:28:23.565392	\N
2415	313	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:23.568589	2026-02-24 14:28:23.568589	\N
2416	313	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:23.571759	2026-02-24 14:28:23.571759	\N
2417	313	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:23.575959	2026-02-24 14:28:23.575959	\N
2418	313	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:23.57932	2026-02-24 14:28:23.57932	\N
2419	313	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:23.582666	2026-02-24 14:28:23.582666	\N
2420	313	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:23.586225	2026-02-24 14:28:23.586225	\N
2421	313	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:23.589249	2026-02-24 14:28:23.589249	\N
2422	313	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:23.593497	2026-02-24 14:28:23.593497	\N
2423	313	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:23.596845	2026-02-24 14:28:23.596845	\N
2424	313	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:23.599842	2026-02-24 14:28:23.599842	\N
2425	313	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:23.603333	2026-02-24 14:28:23.603333	\N
2426	313	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:23.606402	2026-02-24 14:28:23.606402	\N
2427	314	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:23.610215	2026-02-24 14:28:23.610215	\N
2428	314	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:23.613275	2026-02-24 14:28:23.613275	\N
2429	314	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:23.616832	2026-02-24 14:28:23.616832	\N
2430	314	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:23.619599	2026-02-24 14:28:23.619599	\N
2431	314	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:23.621552	2026-02-24 14:28:23.621552	\N
2432	314	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:23.623688	2026-02-24 14:28:23.623688	\N
2433	314	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:23.627104	2026-02-24 14:28:23.627104	\N
2434	314	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:23.62956	2026-02-24 14:28:23.62956	\N
2435	314	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:23.63156	2026-02-24 14:28:23.63156	\N
2436	314	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:23.633849	2026-02-24 14:28:23.633849	\N
2437	314	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:23.635923	2026-02-24 14:28:23.635923	\N
2438	314	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:23.637874	2026-02-24 14:28:23.637874	\N
2439	315	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:23.6399	2026-02-24 14:28:23.6399	\N
2440	315	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:23.643002	2026-02-24 14:28:23.643002	\N
2441	315	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:23.645231	2026-02-24 14:28:23.645231	\N
2442	315	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:23.647119	2026-02-24 14:28:23.647119	\N
2443	315	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:23.649218	2026-02-24 14:28:23.649218	\N
2444	315	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:23.651311	2026-02-24 14:28:23.651311	\N
2445	315	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:23.653349	2026-02-24 14:28:23.653349	\N
2446	315	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:23.655521	2026-02-24 14:28:23.655521	\N
2447	315	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:23.658479	2026-02-24 14:28:23.658479	\N
2448	315	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:23.662037	2026-02-24 14:28:23.662037	\N
2449	315	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:23.665024	2026-02-24 14:28:23.665024	\N
2450	315	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:23.668047	2026-02-24 14:28:23.668047	\N
2451	316	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:23.670732	2026-02-24 14:28:23.670732	\N
2452	316	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:23.675194	2026-02-24 14:28:23.675194	\N
2453	316	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:23.67846	2026-02-24 14:28:23.67846	\N
2454	316	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:23.681274	2026-02-24 14:28:23.681274	\N
2455	316	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:23.683807	2026-02-24 14:28:23.683807	\N
2456	316	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:23.686391	2026-02-24 14:28:23.686391	\N
2457	316	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:23.688494	2026-02-24 14:28:23.688494	\N
2458	316	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:23.692152	2026-02-24 14:28:23.692152	\N
2459	316	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:23.695066	2026-02-24 14:28:23.695066	\N
2460	316	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:23.697223	2026-02-24 14:28:23.697223	\N
2461	316	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:23.699157	2026-02-24 14:28:23.699157	\N
2462	316	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:23.701376	2026-02-24 14:28:23.701376	\N
2463	317	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:23.703622	2026-02-24 14:28:23.703622	\N
2464	317	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:23.705967	2026-02-24 14:28:23.705967	\N
2465	317	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:23.708938	2026-02-24 14:28:23.708938	\N
2466	317	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:23.711385	2026-02-24 14:28:23.711385	\N
2467	317	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:23.713421	2026-02-24 14:28:23.713421	\N
2468	317	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:23.715626	2026-02-24 14:28:23.715626	\N
2469	317	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:23.717717	2026-02-24 14:28:23.717717	\N
2470	317	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:23.719566	2026-02-24 14:28:23.719566	\N
2471	317	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:23.721662	2026-02-24 14:28:23.721662	\N
2472	317	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:23.723627	2026-02-24 14:28:23.723627	\N
2473	317	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:23.726766	2026-02-24 14:28:23.726766	\N
2474	317	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:23.728801	2026-02-24 14:28:23.728801	\N
2475	318	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:23.730939	2026-02-24 14:28:23.730939	\N
2476	318	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:23.733328	2026-02-24 14:28:23.733328	\N
2477	318	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:23.735507	2026-02-24 14:28:23.735507	\N
2478	318	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:23.737778	2026-02-24 14:28:23.737778	\N
2479	318	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:23.73964	2026-02-24 14:28:23.73964	\N
2480	318	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:23.742559	2026-02-24 14:28:23.742559	\N
2481	318	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:23.744949	2026-02-24 14:28:23.744949	\N
2482	318	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:23.746904	2026-02-24 14:28:23.746904	\N
2483	318	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:23.748944	2026-02-24 14:28:23.748944	\N
2484	318	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:23.750915	2026-02-24 14:28:23.750915	\N
2485	318	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:23.752825	2026-02-24 14:28:23.752825	\N
2486	318	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:23.754853	2026-02-24 14:28:23.754853	\N
2487	319	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:23.756941	2026-02-24 14:28:23.756941	\N
2488	319	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:23.76005	2026-02-24 14:28:23.76005	\N
2489	319	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:23.762101	2026-02-24 14:28:23.762101	\N
2490	319	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:23.764095	2026-02-24 14:28:23.764095	\N
2491	319	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:23.766305	2026-02-24 14:28:23.766305	\N
2492	319	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:23.76829	2026-02-24 14:28:23.76829	\N
2493	319	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:23.77038	2026-02-24 14:28:23.77038	\N
2494	319	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:23.77221	2026-02-24 14:28:23.77221	\N
2495	319	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:23.774625	2026-02-24 14:28:23.774625	\N
2496	319	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:23.777597	2026-02-24 14:28:23.777597	\N
2497	319	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:23.779643	2026-02-24 14:28:23.779643	\N
2498	319	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:23.781541	2026-02-24 14:28:23.781541	\N
2499	320	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:23.783443	2026-02-24 14:28:23.783443	\N
2500	320	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:23.785553	2026-02-24 14:28:23.785553	\N
2501	320	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:23.787473	2026-02-24 14:28:23.787473	\N
2502	320	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:23.789853	2026-02-24 14:28:23.789853	\N
2503	320	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:23.792898	2026-02-24 14:28:23.792898	\N
2504	320	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:23.795152	2026-02-24 14:28:23.795152	\N
2505	320	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:23.797432	2026-02-24 14:28:23.797432	\N
2506	320	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:23.799283	2026-02-24 14:28:23.799283	\N
2507	320	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:23.801564	2026-02-24 14:28:23.801564	\N
2508	320	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:23.803375	2026-02-24 14:28:23.803375	\N
2509	320	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:23.80544	2026-02-24 14:28:23.80544	\N
2510	320	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:23.807622	2026-02-24 14:28:23.807622	\N
2511	321	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:23.8107	2026-02-24 14:28:23.8107	\N
2512	321	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:23.812609	2026-02-24 14:28:23.812609	\N
2513	321	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:23.814424	2026-02-24 14:28:23.814424	\N
2514	321	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:23.816773	2026-02-24 14:28:23.816773	\N
2515	321	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:23.818912	2026-02-24 14:28:23.818912	\N
2516	321	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:23.821713	2026-02-24 14:28:23.821713	\N
2517	321	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:23.825852	2026-02-24 14:28:23.825852	\N
2518	321	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:23.828817	2026-02-24 14:28:23.828817	\N
2519	321	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:23.830887	2026-02-24 14:28:23.830887	\N
2520	321	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:23.83335	2026-02-24 14:28:23.83335	\N
2521	321	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:23.835435	2026-02-24 14:28:23.835435	\N
2522	321	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:23.837603	2026-02-24 14:28:23.837603	\N
2523	322	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:23.839655	2026-02-24 14:28:23.839655	\N
2524	322	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:23.842907	2026-02-24 14:28:23.842907	\N
2525	322	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:23.844997	2026-02-24 14:28:23.844997	\N
2526	322	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:23.847235	2026-02-24 14:28:23.847235	\N
2527	322	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:23.849137	2026-02-24 14:28:23.849137	\N
2528	322	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:23.851002	2026-02-24 14:28:23.851002	\N
2529	322	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:23.853132	2026-02-24 14:28:23.853132	\N
2530	322	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:23.855065	2026-02-24 14:28:23.855065	\N
2531	322	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:23.858085	2026-02-24 14:28:23.858085	\N
2532	322	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:23.862343	2026-02-24 14:28:23.862343	\N
2533	322	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:23.865282	2026-02-24 14:28:23.865282	\N
2534	322	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:23.867934	2026-02-24 14:28:23.867934	\N
2535	323	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:23.874941	2026-02-24 14:28:23.874941	\N
2536	323	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:23.87802	2026-02-24 14:28:23.87802	\N
2537	323	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:23.880241	2026-02-24 14:28:23.880241	\N
2538	323	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:23.88258	2026-02-24 14:28:23.88258	\N
2539	323	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:23.884952	2026-02-24 14:28:23.884952	\N
2540	323	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:23.887302	2026-02-24 14:28:23.887302	\N
2541	323	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:23.889779	2026-02-24 14:28:23.889779	\N
2542	323	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:23.893765	2026-02-24 14:28:23.893765	\N
2543	323	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:23.896203	2026-02-24 14:28:23.896203	\N
2544	323	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:23.898263	2026-02-24 14:28:23.898263	\N
2545	323	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:23.900287	2026-02-24 14:28:23.900287	\N
2546	323	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:23.902152	2026-02-24 14:28:23.902152	\N
2547	311	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:23.904105	2026-02-24 14:28:23.904105	\N
2548	311	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:23.906159	2026-02-24 14:28:23.906159	\N
2549	311	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:23.909261	2026-02-24 14:28:23.909261	\N
2550	311	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:23.91158	2026-02-24 14:28:23.91158	\N
2551	311	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:23.913781	2026-02-24 14:28:23.913781	\N
2552	311	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:23.915669	2026-02-24 14:28:23.915669	\N
2553	311	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:23.917872	2026-02-24 14:28:23.917872	\N
2554	311	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:23.919795	2026-02-24 14:28:23.919795	\N
2555	311	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:23.921509	2026-02-24 14:28:23.921509	\N
2556	311	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:23.923401	2026-02-24 14:28:23.923401	\N
2557	311	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:23.926754	2026-02-24 14:28:23.926754	\N
2558	311	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:23.928811	2026-02-24 14:28:23.928811	\N
2559	325	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:23.930649	2026-02-24 14:28:23.930649	\N
2560	325	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:23.932661	2026-02-24 14:28:23.932661	\N
2561	325	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:23.935026	2026-02-24 14:28:23.935026	\N
2562	325	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:23.937188	2026-02-24 14:28:23.937188	\N
2563	325	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:23.939692	2026-02-24 14:28:23.939692	\N
2564	325	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:23.942643	2026-02-24 14:28:23.942643	\N
2565	325	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:23.945095	2026-02-24 14:28:23.945095	\N
2566	325	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:23.947414	2026-02-24 14:28:23.947414	\N
2567	325	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:23.949577	2026-02-24 14:28:23.949577	\N
2568	325	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:23.951464	2026-02-24 14:28:23.951464	\N
2569	325	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:23.953506	2026-02-24 14:28:23.953506	\N
2570	325	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:23.955483	2026-02-24 14:28:23.955483	\N
2571	326	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:23.957552	2026-02-24 14:28:23.957552	\N
2572	326	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:23.960564	2026-02-24 14:28:23.960564	\N
2573	326	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:23.962453	2026-02-24 14:28:23.962453	\N
2574	326	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:23.964617	2026-02-24 14:28:23.964617	\N
2575	326	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:23.966879	2026-02-24 14:28:23.966879	\N
2576	326	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:23.968799	2026-02-24 14:28:23.968799	\N
2577	326	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:23.970933	2026-02-24 14:28:23.970933	\N
2578	326	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:23.972843	2026-02-24 14:28:23.972843	\N
2579	326	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:23.976161	2026-02-24 14:28:23.976161	\N
2580	326	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:23.978275	2026-02-24 14:28:23.978275	\N
2581	326	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:23.980776	2026-02-24 14:28:23.980776	\N
2582	326	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:23.982628	2026-02-24 14:28:23.982628	\N
2583	327	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:23.984572	2026-02-24 14:28:23.984572	\N
2584	327	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:23.986594	2026-02-24 14:28:23.986594	\N
2585	327	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:23.988452	2026-02-24 14:28:23.988452	\N
2586	327	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:23.99043	2026-02-24 14:28:23.99043	\N
2587	327	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:23.993467	2026-02-24 14:28:23.993467	\N
2588	327	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:23.995925	2026-02-24 14:28:23.995925	\N
2589	327	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:23.997881	2026-02-24 14:28:23.997881	\N
2590	327	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.000168	2026-02-24 14:28:24.000168	\N
2591	327	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.002312	2026-02-24 14:28:24.002312	\N
2592	327	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.004163	2026-02-24 14:28:24.004163	\N
2593	327	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.006323	2026-02-24 14:28:24.006323	\N
2594	327	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.009537	2026-02-24 14:28:24.009537	\N
2595	328	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.011887	2026-02-24 14:28:24.011887	\N
2596	328	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.01375	2026-02-24 14:28:24.01375	\N
2597	328	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.015942	2026-02-24 14:28:24.015942	\N
2598	328	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.017944	2026-02-24 14:28:24.017944	\N
2599	328	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.019932	2026-02-24 14:28:24.019932	\N
2600	328	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.022598	2026-02-24 14:28:24.022598	\N
2601	328	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.025935	2026-02-24 14:28:24.025935	\N
2602	328	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.028734	2026-02-24 14:28:24.028734	\N
2603	328	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.030935	2026-02-24 14:28:24.030935	\N
2604	328	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.033138	2026-02-24 14:28:24.033138	\N
2605	328	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.035474	2026-02-24 14:28:24.035474	\N
2606	328	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.03766	2026-02-24 14:28:24.03766	\N
2607	329	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.039618	2026-02-24 14:28:24.039618	\N
2608	329	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.043617	2026-02-24 14:28:24.043617	\N
2609	329	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.04612	2026-02-24 14:28:24.04612	\N
2610	329	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.048734	2026-02-24 14:28:24.048734	\N
2611	329	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.05068	2026-02-24 14:28:24.05068	\N
2612	329	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.052438	2026-02-24 14:28:24.052438	\N
2613	329	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.054371	2026-02-24 14:28:24.054371	\N
2614	329	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.056518	2026-02-24 14:28:24.056518	\N
2615	329	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.059793	2026-02-24 14:28:24.059793	\N
2616	329	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.062781	2026-02-24 14:28:24.062781	\N
2617	329	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.065399	2026-02-24 14:28:24.065399	\N
2618	329	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.06756	2026-02-24 14:28:24.06756	\N
2619	330	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.076119	2026-02-24 14:28:24.076119	\N
2620	330	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.078543	2026-02-24 14:28:24.078543	\N
2621	330	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.080764	2026-02-24 14:28:24.080764	\N
2622	330	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.082987	2026-02-24 14:28:24.082987	\N
2623	330	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.085225	2026-02-24 14:28:24.085225	\N
2624	330	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.08737	2026-02-24 14:28:24.08737	\N
2625	330	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.09047	2026-02-24 14:28:24.09047	\N
2626	330	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.094102	2026-02-24 14:28:24.094102	\N
2627	330	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.096388	2026-02-24 14:28:24.096388	\N
2628	330	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.098381	2026-02-24 14:28:24.098381	\N
2629	330	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.100587	2026-02-24 14:28:24.100587	\N
2630	330	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.10276	2026-02-24 14:28:24.10276	\N
2631	331	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.104879	2026-02-24 14:28:24.104879	\N
2632	331	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.106824	2026-02-24 14:28:24.106824	\N
2633	331	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.110266	2026-02-24 14:28:24.110266	\N
2634	331	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.112224	2026-02-24 14:28:24.112224	\N
2635	331	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.114082	2026-02-24 14:28:24.114082	\N
2636	331	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.11637	2026-02-24 14:28:24.11637	\N
2637	331	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.118266	2026-02-24 14:28:24.118266	\N
2638	331	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.120329	2026-02-24 14:28:24.120329	\N
2639	331	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.122299	2026-02-24 14:28:24.122299	\N
2640	331	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.124554	2026-02-24 14:28:24.124554	\N
2641	331	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.127571	2026-02-24 14:28:24.127571	\N
2642	331	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.129565	2026-02-24 14:28:24.129565	\N
2643	332	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.131547	2026-02-24 14:28:24.131547	\N
2644	332	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.133326	2026-02-24 14:28:24.133326	\N
2645	332	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.13597	2026-02-24 14:28:24.13597	\N
2646	332	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.138215	2026-02-24 14:28:24.138215	\N
2647	332	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.140114	2026-02-24 14:28:24.140114	\N
2648	332	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.14344	2026-02-24 14:28:24.14344	\N
2649	332	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.145584	2026-02-24 14:28:24.145584	\N
2650	332	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.147478	2026-02-24 14:28:24.147478	\N
2651	332	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.149352	2026-02-24 14:28:24.149352	\N
2652	332	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.151585	2026-02-24 14:28:24.151585	\N
2653	332	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.153599	2026-02-24 14:28:24.153599	\N
2654	332	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.155835	2026-02-24 14:28:24.155835	\N
2655	333	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.158855	2026-02-24 14:28:24.158855	\N
2656	333	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.161232	2026-02-24 14:28:24.161232	\N
2657	333	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.163266	2026-02-24 14:28:24.163266	\N
2658	333	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.16547	2026-02-24 14:28:24.16547	\N
2659	333	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.167389	2026-02-24 14:28:24.167389	\N
2660	333	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.169311	2026-02-24 14:28:24.169311	\N
2661	333	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.171301	2026-02-24 14:28:24.171301	\N
2662	333	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.173189	2026-02-24 14:28:24.173189	\N
2663	333	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.176584	2026-02-24 14:28:24.176584	\N
2664	333	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.178695	2026-02-24 14:28:24.178695	\N
2665	333	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.18099	2026-02-24 14:28:24.18099	\N
2666	333	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.183462	2026-02-24 14:28:24.183462	\N
2667	334	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.186015	2026-02-24 14:28:24.186015	\N
2668	334	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.188103	2026-02-24 14:28:24.188103	\N
2669	334	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.190078	2026-02-24 14:28:24.190078	\N
2670	334	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.193057	2026-02-24 14:28:24.193057	\N
2671	334	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.195148	2026-02-24 14:28:24.195148	\N
2672	334	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.19724	2026-02-24 14:28:24.19724	\N
2673	334	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.199083	2026-02-24 14:28:24.199083	\N
2674	334	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.201072	2026-02-24 14:28:24.201072	\N
2675	334	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.203004	2026-02-24 14:28:24.203004	\N
2676	334	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.20498	2026-02-24 14:28:24.20498	\N
2677	334	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.207049	2026-02-24 14:28:24.207049	\N
2678	334	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.210091	2026-02-24 14:28:24.210091	\N
2679	335	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.212464	2026-02-24 14:28:24.212464	\N
2680	335	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.214295	2026-02-24 14:28:24.214295	\N
2681	335	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.216476	2026-02-24 14:28:24.216476	\N
2682	335	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.218376	2026-02-24 14:28:24.218376	\N
2683	335	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.220267	2026-02-24 14:28:24.220267	\N
2684	335	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.222153	2026-02-24 14:28:24.222153	\N
2685	335	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.224218	2026-02-24 14:28:24.224218	\N
2686	335	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.227419	2026-02-24 14:28:24.227419	\N
2687	335	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.229451	2026-02-24 14:28:24.229451	\N
2688	335	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.231575	2026-02-24 14:28:24.231575	\N
2689	335	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.233643	2026-02-24 14:28:24.233643	\N
2690	335	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.235522	2026-02-24 14:28:24.235522	\N
2691	310	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.237713	2026-02-24 14:28:24.237713	\N
2692	310	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.239529	2026-02-24 14:28:24.239529	\N
2693	310	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.242768	2026-02-24 14:28:24.242768	\N
2694	310	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.245208	2026-02-24 14:28:24.245208	\N
2695	310	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.247582	2026-02-24 14:28:24.247582	\N
2696	310	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.24968	2026-02-24 14:28:24.24968	\N
2697	310	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.251891	2026-02-24 14:28:24.251891	\N
2698	310	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.253855	2026-02-24 14:28:24.253855	\N
2699	310	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.255838	2026-02-24 14:28:24.255838	\N
2700	310	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.259102	2026-02-24 14:28:24.259102	\N
2701	310	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.261979	2026-02-24 14:28:24.261979	\N
2702	310	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.264441	2026-02-24 14:28:24.264441	\N
2703	337	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.26667	2026-02-24 14:28:24.26667	\N
2704	337	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.271143	2026-02-24 14:28:24.271143	\N
2705	337	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.273627	2026-02-24 14:28:24.273627	\N
2706	337	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.277329	2026-02-24 14:28:24.277329	\N
2707	337	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.279497	2026-02-24 14:28:24.279497	\N
2708	337	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.281892	2026-02-24 14:28:24.281892	\N
2709	337	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.284093	2026-02-24 14:28:24.284093	\N
2710	337	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.286377	2026-02-24 14:28:24.286377	\N
2711	337	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.288839	2026-02-24 14:28:24.288839	\N
2712	337	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.291877	2026-02-24 14:28:24.291877	\N
2713	337	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.294918	2026-02-24 14:28:24.294918	\N
2714	337	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.297194	2026-02-24 14:28:24.297194	\N
2715	338	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.29923	2026-02-24 14:28:24.29923	\N
2716	338	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.301278	2026-02-24 14:28:24.301278	\N
2717	338	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.303379	2026-02-24 14:28:24.303379	\N
2718	338	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.30542	2026-02-24 14:28:24.30542	\N
2719	338	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.308243	2026-02-24 14:28:24.308243	\N
2720	338	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.310752	2026-02-24 14:28:24.310752	\N
2721	338	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.312955	2026-02-24 14:28:24.312955	\N
2722	338	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.314892	2026-02-24 14:28:24.314892	\N
2723	338	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.316773	2026-02-24 14:28:24.316773	\N
2724	338	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.319002	2026-02-24 14:28:24.319002	\N
2725	338	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.320823	2026-02-24 14:28:24.320823	\N
2726	338	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.322835	2026-02-24 14:28:24.322835	\N
2727	339	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.326045	2026-02-24 14:28:24.326045	\N
2728	339	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.328354	2026-02-24 14:28:24.328354	\N
2729	339	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.330711	2026-02-24 14:28:24.330711	\N
2730	339	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.332973	2026-02-24 14:28:24.332973	\N
2731	339	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.335792	2026-02-24 14:28:24.335792	\N
2732	339	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.33804	2026-02-24 14:28:24.33804	\N
2733	339	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.340046	2026-02-24 14:28:24.340046	\N
2734	339	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.343186	2026-02-24 14:28:24.343186	\N
2735	339	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.34536	2026-02-24 14:28:24.34536	\N
2736	339	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.347401	2026-02-24 14:28:24.347401	\N
2737	339	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.349359	2026-02-24 14:28:24.349359	\N
2738	339	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.351266	2026-02-24 14:28:24.351266	\N
2739	340	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.353245	2026-02-24 14:28:24.353245	\N
2740	340	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.355125	2026-02-24 14:28:24.355125	\N
2741	340	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.356975	2026-02-24 14:28:24.356975	\N
2742	340	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.360216	2026-02-24 14:28:24.360216	\N
2743	340	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.362275	2026-02-24 14:28:24.362275	\N
2744	340	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.364322	2026-02-24 14:28:24.364322	\N
2745	340	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.366185	2026-02-24 14:28:24.366185	\N
2746	340	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.368181	2026-02-24 14:28:24.368181	\N
2747	340	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.370113	2026-02-24 14:28:24.370113	\N
2748	340	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.372036	2026-02-24 14:28:24.372036	\N
2749	340	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.374172	2026-02-24 14:28:24.374172	\N
2750	340	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.377238	2026-02-24 14:28:24.377238	\N
2751	341	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.37928	2026-02-24 14:28:24.37928	\N
2752	341	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.381109	2026-02-24 14:28:24.381109	\N
2753	341	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.383302	2026-02-24 14:28:24.383302	\N
2754	341	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.385327	2026-02-24 14:28:24.385327	\N
2755	341	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.387129	2026-02-24 14:28:24.387129	\N
2756	341	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.389098	2026-02-24 14:28:24.389098	\N
2757	341	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.391833	2026-02-24 14:28:24.391833	\N
2758	341	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.394367	2026-02-24 14:28:24.394367	\N
2759	341	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.396416	2026-02-24 14:28:24.396416	\N
2760	341	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.39845	2026-02-24 14:28:24.39845	\N
2761	341	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.400285	2026-02-24 14:28:24.400285	\N
2762	341	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.402037	2026-02-24 14:28:24.402037	\N
2763	342	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.404145	2026-02-24 14:28:24.404145	\N
2764	342	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.406038	2026-02-24 14:28:24.406038	\N
2765	342	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.409236	2026-02-24 14:28:24.409236	\N
2766	342	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.411753	2026-02-24 14:28:24.411753	\N
2767	342	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.414039	2026-02-24 14:28:24.414039	\N
2768	342	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.416193	2026-02-24 14:28:24.416193	\N
2769	342	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.418257	2026-02-24 14:28:24.418257	\N
2770	342	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.420124	2026-02-24 14:28:24.420124	\N
2771	342	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.421901	2026-02-24 14:28:24.421901	\N
2772	342	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.423989	2026-02-24 14:28:24.423989	\N
2773	342	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.426974	2026-02-24 14:28:24.426974	\N
2774	342	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.42914	2026-02-24 14:28:24.42914	\N
2775	343	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.431101	2026-02-24 14:28:24.431101	\N
2776	343	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.433282	2026-02-24 14:28:24.433282	\N
2777	343	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.435954	2026-02-24 14:28:24.435954	\N
2778	343	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.438357	2026-02-24 14:28:24.438357	\N
2779	343	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.440349	2026-02-24 14:28:24.440349	\N
2780	343	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.443602	2026-02-24 14:28:24.443602	\N
2781	343	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.44581	2026-02-24 14:28:24.44581	\N
2782	343	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.447951	2026-02-24 14:28:24.447951	\N
2783	343	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.449981	2026-02-24 14:28:24.449981	\N
2784	343	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.451893	2026-02-24 14:28:24.451893	\N
2785	343	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.453798	2026-02-24 14:28:24.453798	\N
2786	343	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.45571	2026-02-24 14:28:24.45571	\N
2787	344	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.458626	2026-02-24 14:28:24.458626	\N
2788	344	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.461355	2026-02-24 14:28:24.461355	\N
2789	344	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.463883	2026-02-24 14:28:24.463883	\N
2790	344	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.466426	2026-02-24 14:28:24.466426	\N
2791	344	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.473116	2026-02-24 14:28:24.473116	\N
2792	344	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.47693	2026-02-24 14:28:24.47693	\N
2793	344	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.479236	2026-02-24 14:28:24.479236	\N
2794	344	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.481456	2026-02-24 14:28:24.481456	\N
2795	344	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.483661	2026-02-24 14:28:24.483661	\N
2796	344	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.48568	2026-02-24 14:28:24.48568	\N
2797	344	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.488049	2026-02-24 14:28:24.488049	\N
2798	344	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.49152	2026-02-24 14:28:24.49152	\N
2799	345	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.495011	2026-02-24 14:28:24.495011	\N
2800	345	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.497164	2026-02-24 14:28:24.497164	\N
2801	345	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.499364	2026-02-24 14:28:24.499364	\N
2802	345	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.5013	2026-02-24 14:28:24.5013	\N
2803	345	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.503213	2026-02-24 14:28:24.503213	\N
2804	345	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.505111	2026-02-24 14:28:24.505111	\N
2805	345	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.507048	2026-02-24 14:28:24.507048	\N
2806	345	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.510726	2026-02-24 14:28:24.510726	\N
2807	345	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.512639	2026-02-24 14:28:24.512639	\N
2808	345	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.514884	2026-02-24 14:28:24.514884	\N
2809	345	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.516781	2026-02-24 14:28:24.516781	\N
2810	345	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.518553	2026-02-24 14:28:24.518553	\N
2811	346	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.520726	2026-02-24 14:28:24.520726	\N
2812	346	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.522782	2026-02-24 14:28:24.522782	\N
2813	346	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.526576	2026-02-24 14:28:24.526576	\N
2814	346	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.528682	2026-02-24 14:28:24.528682	\N
2815	346	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.530666	2026-02-24 14:28:24.530666	\N
2816	346	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.532655	2026-02-24 14:28:24.532655	\N
2817	346	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.534769	2026-02-24 14:28:24.534769	\N
2818	346	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.536737	2026-02-24 14:28:24.536737	\N
2819	346	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.538506	2026-02-24 14:28:24.538506	\N
2820	346	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.541455	2026-02-24 14:28:24.541455	\N
2821	346	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.544107	2026-02-24 14:28:24.544107	\N
2822	346	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.546264	2026-02-24 14:28:24.546264	\N
2823	347	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.548258	2026-02-24 14:28:24.548258	\N
2824	347	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.550383	2026-02-24 14:28:24.550383	\N
2825	347	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.552484	2026-02-24 14:28:24.552484	\N
2826	347	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.555271	2026-02-24 14:28:24.555271	\N
2827	347	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.557378	2026-02-24 14:28:24.557378	\N
2828	347	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.560711	2026-02-24 14:28:24.560711	\N
2829	347	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.562642	2026-02-24 14:28:24.562642	\N
2830	347	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.56471	2026-02-24 14:28:24.56471	\N
2831	347	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.566899	2026-02-24 14:28:24.566899	\N
2832	347	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.568782	2026-02-24 14:28:24.568782	\N
2833	347	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.570763	2026-02-24 14:28:24.570763	\N
2834	347	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.572782	2026-02-24 14:28:24.572782	\N
2835	309	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.575997	2026-02-24 14:28:24.575997	\N
2836	309	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.57811	2026-02-24 14:28:24.57811	\N
2837	309	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.580182	2026-02-24 14:28:24.580182	\N
2838	309	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.58203	2026-02-24 14:28:24.58203	\N
2839	309	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.583833	2026-02-24 14:28:24.583833	\N
2840	309	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.58616	2026-02-24 14:28:24.58616	\N
2841	309	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.588367	2026-02-24 14:28:24.588367	\N
2842	309	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.590345	2026-02-24 14:28:24.590345	\N
2843	309	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.593333	2026-02-24 14:28:24.593333	\N
2844	309	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.595461	2026-02-24 14:28:24.595461	\N
2845	309	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.597425	2026-02-24 14:28:24.597425	\N
2846	309	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.599352	2026-02-24 14:28:24.599352	\N
2847	349	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.601263	2026-02-24 14:28:24.601263	\N
2848	349	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.603061	2026-02-24 14:28:24.603061	\N
2849	349	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.605159	2026-02-24 14:28:24.605159	\N
2850	349	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.607064	2026-02-24 14:28:24.607064	\N
2851	349	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.610231	2026-02-24 14:28:24.610231	\N
2852	349	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.61214	2026-02-24 14:28:24.61214	\N
2853	349	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.61393	2026-02-24 14:28:24.61393	\N
2854	349	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.616158	2026-02-24 14:28:24.616158	\N
2855	349	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.618253	2026-02-24 14:28:24.618253	\N
2856	349	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.620344	2026-02-24 14:28:24.620344	\N
2857	349	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.622153	2026-02-24 14:28:24.622153	\N
2858	349	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.62454	2026-02-24 14:28:24.62454	\N
2859	350	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.627452	2026-02-24 14:28:24.627452	\N
2860	350	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.629744	2026-02-24 14:28:24.629744	\N
2861	350	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.631993	2026-02-24 14:28:24.631993	\N
2862	350	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.63392	2026-02-24 14:28:24.63392	\N
2863	350	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.636417	2026-02-24 14:28:24.636417	\N
2864	350	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.638298	2026-02-24 14:28:24.638298	\N
2865	350	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.640282	2026-02-24 14:28:24.640282	\N
2866	350	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.643336	2026-02-24 14:28:24.643336	\N
2867	350	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.645471	2026-02-24 14:28:24.645471	\N
2868	350	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.647352	2026-02-24 14:28:24.647352	\N
2869	350	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.649311	2026-02-24 14:28:24.649311	\N
2870	350	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.651567	2026-02-24 14:28:24.651567	\N
2871	351	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.653787	2026-02-24 14:28:24.653787	\N
2872	351	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.655988	2026-02-24 14:28:24.655988	\N
2873	351	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.658868	2026-02-24 14:28:24.658868	\N
2874	351	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.662021	2026-02-24 14:28:24.662021	\N
2875	351	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.66519	2026-02-24 14:28:24.66519	\N
2876	351	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.667611	2026-02-24 14:28:24.667611	\N
2877	351	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.673403	2026-02-24 14:28:24.673403	\N
2878	351	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.677047	2026-02-24 14:28:24.677047	\N
2879	351	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.679409	2026-02-24 14:28:24.679409	\N
2880	351	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.68148	2026-02-24 14:28:24.68148	\N
2881	351	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.683876	2026-02-24 14:28:24.683876	\N
2882	351	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.686128	2026-02-24 14:28:24.686128	\N
2883	352	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.688501	2026-02-24 14:28:24.688501	\N
2884	352	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.691845	2026-02-24 14:28:24.691845	\N
2885	352	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.694377	2026-02-24 14:28:24.694377	\N
2886	352	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.696998	2026-02-24 14:28:24.696998	\N
2887	352	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.710253	2026-02-24 14:28:24.710253	\N
2888	352	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.712208	2026-02-24 14:28:24.712208	\N
2889	352	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.714055	2026-02-24 14:28:24.714055	\N
2890	352	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.716161	2026-02-24 14:28:24.716161	\N
2891	352	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.718301	2026-02-24 14:28:24.718301	\N
2892	352	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.720379	2026-02-24 14:28:24.720379	\N
2893	352	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.722222	2026-02-24 14:28:24.722222	\N
2894	352	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.724415	2026-02-24 14:28:24.724415	\N
2895	353	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.727453	2026-02-24 14:28:24.727453	\N
2896	353	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.729706	2026-02-24 14:28:24.729706	\N
2897	353	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.731612	2026-02-24 14:28:24.731612	\N
2898	353	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.73361	2026-02-24 14:28:24.73361	\N
2899	353	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.735711	2026-02-24 14:28:24.735711	\N
2900	353	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.73755	2026-02-24 14:28:24.73755	\N
2901	353	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.739508	2026-02-24 14:28:24.739508	\N
2902	353	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.742459	2026-02-24 14:28:24.742459	\N
2903	353	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.744969	2026-02-24 14:28:24.744969	\N
2904	353	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.747071	2026-02-24 14:28:24.747071	\N
2905	353	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.749075	2026-02-24 14:28:24.749075	\N
2906	353	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.751158	2026-02-24 14:28:24.751158	\N
2907	354	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.753092	2026-02-24 14:28:24.753092	\N
2908	354	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.755134	2026-02-24 14:28:24.755134	\N
2909	354	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.757175	2026-02-24 14:28:24.757175	\N
2910	354	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.760332	2026-02-24 14:28:24.760332	\N
2911	354	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.762339	2026-02-24 14:28:24.762339	\N
2912	354	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.76468	2026-02-24 14:28:24.76468	\N
2913	354	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.767075	2026-02-24 14:28:24.767075	\N
2914	354	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.769007	2026-02-24 14:28:24.769007	\N
2915	354	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.770908	2026-02-24 14:28:24.770908	\N
2916	354	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.772671	2026-02-24 14:28:24.772671	\N
2917	354	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.776156	2026-02-24 14:28:24.776156	\N
2918	354	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.778328	2026-02-24 14:28:24.778328	\N
2919	355	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.780434	2026-02-24 14:28:24.780434	\N
2920	355	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.782354	2026-02-24 14:28:24.782354	\N
2921	355	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.784262	2026-02-24 14:28:24.784262	\N
2922	355	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.786306	2026-02-24 14:28:24.786306	\N
2923	355	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.78827	2026-02-24 14:28:24.78827	\N
2924	355	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.790273	2026-02-24 14:28:24.790273	\N
2925	355	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.793315	2026-02-24 14:28:24.793315	\N
2926	355	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.795504	2026-02-24 14:28:24.795504	\N
2927	355	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.797407	2026-02-24 14:28:24.797407	\N
2928	355	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.79934	2026-02-24 14:28:24.79934	\N
2929	355	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.801405	2026-02-24 14:28:24.801405	\N
2930	355	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.80323	2026-02-24 14:28:24.80323	\N
2931	356	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.805346	2026-02-24 14:28:24.805346	\N
2932	356	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.80746	2026-02-24 14:28:24.80746	\N
2933	356	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.810608	2026-02-24 14:28:24.810608	\N
2934	356	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.812635	2026-02-24 14:28:24.812635	\N
2935	356	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.814514	2026-02-24 14:28:24.814514	\N
2936	356	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.816647	2026-02-24 14:28:24.816647	\N
2937	356	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.818584	2026-02-24 14:28:24.818584	\N
2938	356	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.820523	2026-02-24 14:28:24.820523	\N
2939	356	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.822395	2026-02-24 14:28:24.822395	\N
2940	356	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.825566	2026-02-24 14:28:24.825566	\N
2941	356	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.828127	2026-02-24 14:28:24.828127	\N
2942	356	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.830032	2026-02-24 14:28:24.830032	\N
2943	357	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.831962	2026-02-24 14:28:24.831962	\N
2944	357	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.834046	2026-02-24 14:28:24.834046	\N
2945	357	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.836214	2026-02-24 14:28:24.836214	\N
2946	357	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.838069	2026-02-24 14:28:24.838069	\N
2947	357	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.839981	2026-02-24 14:28:24.839981	\N
2948	357	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.843263	2026-02-24 14:28:24.843263	\N
2949	357	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.845398	2026-02-24 14:28:24.845398	\N
2950	357	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.847435	2026-02-24 14:28:24.847435	\N
2951	357	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.849216	2026-02-24 14:28:24.849216	\N
2952	357	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.851245	2026-02-24 14:28:24.851245	\N
2953	357	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.853321	2026-02-24 14:28:24.853321	\N
2954	357	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.855349	2026-02-24 14:28:24.855349	\N
2955	358	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.857669	2026-02-24 14:28:24.857669	\N
2956	358	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.860943	2026-02-24 14:28:24.860943	\N
2957	358	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.863431	2026-02-24 14:28:24.863431	\N
2958	358	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.866058	2026-02-24 14:28:24.866058	\N
2959	358	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.86818	2026-02-24 14:28:24.86818	\N
2960	358	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.873258	2026-02-24 14:28:24.873258	\N
2961	358	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.877088	2026-02-24 14:28:24.877088	\N
2962	358	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.879539	2026-02-24 14:28:24.879539	\N
2963	358	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.881639	2026-02-24 14:28:24.881639	\N
2964	358	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.884024	2026-02-24 14:28:24.884024	\N
2965	358	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.886124	2026-02-24 14:28:24.886124	\N
2966	358	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.888573	2026-02-24 14:28:24.888573	\N
2967	359	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.891815	2026-02-24 14:28:24.891815	\N
2968	359	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.894312	2026-02-24 14:28:24.894312	\N
2969	359	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.896507	2026-02-24 14:28:24.896507	\N
2970	359	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.898507	2026-02-24 14:28:24.898507	\N
2971	359	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.90029	2026-02-24 14:28:24.90029	\N
2972	359	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.902023	2026-02-24 14:28:24.902023	\N
2973	359	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.90408	2026-02-24 14:28:24.90408	\N
2974	359	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.906003	2026-02-24 14:28:24.906003	\N
2975	359	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.909067	2026-02-24 14:28:24.909067	\N
2976	359	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.911419	2026-02-24 14:28:24.911419	\N
2977	359	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.913512	2026-02-24 14:28:24.913512	\N
2978	359	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.91538	2026-02-24 14:28:24.91538	\N
2979	308	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.917342	2026-02-24 14:28:24.917342	\N
2980	308	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.919466	2026-02-24 14:28:24.919466	\N
2981	308	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.921858	2026-02-24 14:28:24.921858	\N
2982	308	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.924998	2026-02-24 14:28:24.924998	\N
2983	308	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.927522	2026-02-24 14:28:24.927522	\N
2984	308	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.929785	2026-02-24 14:28:24.929785	\N
2985	308	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.931995	2026-02-24 14:28:24.931995	\N
2986	308	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.933849	2026-02-24 14:28:24.933849	\N
2987	308	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.936338	2026-02-24 14:28:24.936338	\N
2988	308	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.938323	2026-02-24 14:28:24.938323	\N
2989	308	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.940373	2026-02-24 14:28:24.940373	\N
2990	308	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.943319	2026-02-24 14:28:24.943319	\N
2991	361	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.945699	2026-02-24 14:28:24.945699	\N
2992	361	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.947807	2026-02-24 14:28:24.947807	\N
2993	361	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.950132	2026-02-24 14:28:24.950132	\N
2994	361	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.952091	2026-02-24 14:28:24.952091	\N
2995	361	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.95385	2026-02-24 14:28:24.95385	\N
2996	361	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.95607	2026-02-24 14:28:24.95607	\N
2997	361	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.959122	2026-02-24 14:28:24.959122	\N
2998	361	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.961291	2026-02-24 14:28:24.961291	\N
2999	361	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.963085	2026-02-24 14:28:24.963085	\N
3000	361	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.96532	2026-02-24 14:28:24.96532	\N
3001	361	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.967387	2026-02-24 14:28:24.967387	\N
3002	361	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.969357	2026-02-24 14:28:24.969357	\N
3003	362	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.971362	2026-02-24 14:28:24.971362	\N
3004	362	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.973084	2026-02-24 14:28:24.973084	\N
3005	362	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:24.976325	2026-02-24 14:28:24.976325	\N
3006	362	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:24.978444	2026-02-24 14:28:24.978444	\N
3007	362	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:24.980382	2026-02-24 14:28:24.980382	\N
3008	362	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:24.982213	2026-02-24 14:28:24.982213	\N
3009	362	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:24.984337	2026-02-24 14:28:24.984337	\N
3010	362	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:24.986371	2026-02-24 14:28:24.986371	\N
3011	362	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:24.988135	2026-02-24 14:28:24.988135	\N
3012	362	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:24.99016	2026-02-24 14:28:24.99016	\N
3013	362	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:24.993082	2026-02-24 14:28:24.993082	\N
3014	362	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:24.995389	2026-02-24 14:28:24.995389	\N
3015	363	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:24.997481	2026-02-24 14:28:24.997481	\N
3016	363	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:24.99941	2026-02-24 14:28:24.99941	\N
3017	363	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.001298	2026-02-24 14:28:25.001298	\N
3018	363	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.003294	2026-02-24 14:28:25.003294	\N
3019	363	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.005308	2026-02-24 14:28:25.005308	\N
3020	363	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.007219	2026-02-24 14:28:25.007219	\N
3021	363	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.010844	2026-02-24 14:28:25.010844	\N
3022	363	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.015466	2026-02-24 14:28:25.015466	\N
3023	363	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.021748	2026-02-24 14:28:25.021748	\N
3024	363	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.029655	2026-02-24 14:28:25.029655	\N
3025	363	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.034038	2026-02-24 14:28:25.034038	\N
3026	363	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.036979	2026-02-24 14:28:25.036979	\N
3027	364	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.038923	2026-02-24 14:28:25.038923	\N
3028	364	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.041531	2026-02-24 14:28:25.041531	\N
3029	364	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.044497	2026-02-24 14:28:25.044497	\N
3030	364	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.04653	2026-02-24 14:28:25.04653	\N
3031	364	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.048282	2026-02-24 14:28:25.048282	\N
3032	364	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.050359	2026-02-24 14:28:25.050359	\N
3033	364	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.052246	2026-02-24 14:28:25.052246	\N
3034	364	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.054032	2026-02-24 14:28:25.054032	\N
3035	364	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.056235	2026-02-24 14:28:25.056235	\N
3036	364	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.060437	2026-02-24 14:28:25.060437	\N
3037	364	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.062985	2026-02-24 14:28:25.062985	\N
3038	364	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.065717	2026-02-24 14:28:25.065717	\N
3039	365	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.068035	2026-02-24 14:28:25.068035	\N
3040	365	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.070241	2026-02-24 14:28:25.070241	\N
3041	365	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.07658	2026-02-24 14:28:25.07658	\N
3042	365	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.079184	2026-02-24 14:28:25.079184	\N
3043	365	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.081655	2026-02-24 14:28:25.081655	\N
3044	365	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.08456	2026-02-24 14:28:25.08456	\N
3045	365	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.086829	2026-02-24 14:28:25.086829	\N
3046	365	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.089809	2026-02-24 14:28:25.089809	\N
3047	365	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.094058	2026-02-24 14:28:25.094058	\N
3048	365	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.097063	2026-02-24 14:28:25.097063	\N
3049	365	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.099297	2026-02-24 14:28:25.099297	\N
3050	365	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.101253	2026-02-24 14:28:25.101253	\N
3051	366	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.103484	2026-02-24 14:28:25.103484	\N
3052	366	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.105665	2026-02-24 14:28:25.105665	\N
3053	366	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.108474	2026-02-24 14:28:25.108474	\N
3054	366	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.110838	2026-02-24 14:28:25.110838	\N
3055	366	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.112824	2026-02-24 14:28:25.112824	\N
3056	366	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.11461	2026-02-24 14:28:25.11461	\N
3057	366	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.116566	2026-02-24 14:28:25.116566	\N
3058	366	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.118669	2026-02-24 14:28:25.118669	\N
3059	366	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.120458	2026-02-24 14:28:25.120458	\N
3060	366	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.122373	2026-02-24 14:28:25.122373	\N
3061	366	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.124987	2026-02-24 14:28:25.124987	\N
3062	366	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.127631	2026-02-24 14:28:25.127631	\N
3063	367	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.129613	2026-02-24 14:28:25.129613	\N
3064	367	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.131574	2026-02-24 14:28:25.131574	\N
3065	367	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.133492	2026-02-24 14:28:25.133492	\N
3066	367	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.135351	2026-02-24 14:28:25.135351	\N
3067	367	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.137566	2026-02-24 14:28:25.137566	\N
3068	367	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.139637	2026-02-24 14:28:25.139637	\N
3069	367	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.142595	2026-02-24 14:28:25.142595	\N
3070	367	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.144793	2026-02-24 14:28:25.144793	\N
3071	367	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.146619	2026-02-24 14:28:25.146619	\N
3072	367	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.148727	2026-02-24 14:28:25.148727	\N
3073	367	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.15079	2026-02-24 14:28:25.15079	\N
3074	367	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.152571	2026-02-24 14:28:25.152571	\N
3075	368	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.154692	2026-02-24 14:28:25.154692	\N
3076	368	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.156607	2026-02-24 14:28:25.156607	\N
3077	368	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.159916	2026-02-24 14:28:25.159916	\N
3078	368	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.161928	2026-02-24 14:28:25.161928	\N
3079	368	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.163854	2026-02-24 14:28:25.163854	\N
3080	368	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.165785	2026-02-24 14:28:25.165785	\N
3081	368	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.167768	2026-02-24 14:28:25.167768	\N
3082	368	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.170241	2026-02-24 14:28:25.170241	\N
3083	368	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.172077	2026-02-24 14:28:25.172077	\N
3084	368	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.17471	2026-02-24 14:28:25.17471	\N
3085	368	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.177256	2026-02-24 14:28:25.177256	\N
3086	368	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.179313	2026-02-24 14:28:25.179313	\N
3087	369	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.181216	2026-02-24 14:28:25.181216	\N
3088	369	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.182971	2026-02-24 14:28:25.182971	\N
3089	369	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.185241	2026-02-24 14:28:25.185241	\N
3090	369	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.187151	2026-02-24 14:28:25.187151	\N
3091	369	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.189099	2026-02-24 14:28:25.189099	\N
3092	369	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.191902	2026-02-24 14:28:25.191902	\N
3093	369	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.194431	2026-02-24 14:28:25.194431	\N
3094	369	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.196349	2026-02-24 14:28:25.196349	\N
3095	369	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.198275	2026-02-24 14:28:25.198275	\N
3096	369	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.200275	2026-02-24 14:28:25.200275	\N
3097	369	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.202135	2026-02-24 14:28:25.202135	\N
3098	369	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.204133	2026-02-24 14:28:25.204133	\N
3099	370	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.206113	2026-02-24 14:28:25.206113	\N
3100	370	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.208892	2026-02-24 14:28:25.208892	\N
3101	370	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.211274	2026-02-24 14:28:25.211274	\N
3102	370	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.213068	2026-02-24 14:28:25.213068	\N
3103	370	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.215059	2026-02-24 14:28:25.215059	\N
3104	370	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.217658	2026-02-24 14:28:25.217658	\N
3105	370	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.220461	2026-02-24 14:28:25.220461	\N
3106	370	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.222925	2026-02-24 14:28:25.222925	\N
3107	370	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.226272	2026-02-24 14:28:25.226272	\N
3108	370	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.228279	2026-02-24 14:28:25.228279	\N
3109	370	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.230306	2026-02-24 14:28:25.230306	\N
3110	370	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.232221	2026-02-24 14:28:25.232221	\N
3111	371	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.234195	2026-02-24 14:28:25.234195	\N
3112	371	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.236315	2026-02-24 14:28:25.236315	\N
3113	371	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.238144	2026-02-24 14:28:25.238144	\N
3114	371	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.240193	2026-02-24 14:28:25.240193	\N
3115	371	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.243518	2026-02-24 14:28:25.243518	\N
3116	371	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.245627	2026-02-24 14:28:25.245627	\N
3117	371	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.247477	2026-02-24 14:28:25.247477	\N
3118	371	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.249463	2026-02-24 14:28:25.249463	\N
3119	371	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.251359	2026-02-24 14:28:25.251359	\N
3120	371	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.253195	2026-02-24 14:28:25.253195	\N
3121	371	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.25543	2026-02-24 14:28:25.25543	\N
3122	371	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.25805	2026-02-24 14:28:25.25805	\N
3123	307	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.260738	2026-02-24 14:28:25.260738	\N
3124	307	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.263085	2026-02-24 14:28:25.263085	\N
3125	307	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.265827	2026-02-24 14:28:25.265827	\N
3126	307	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.26828	2026-02-24 14:28:25.26828	\N
3127	307	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.270684	2026-02-24 14:28:25.270684	\N
3128	307	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.2758	2026-02-24 14:28:25.2758	\N
3129	307	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.278443	2026-02-24 14:28:25.278443	\N
3130	307	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.280585	2026-02-24 14:28:25.280585	\N
3131	307	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.283455	2026-02-24 14:28:25.283455	\N
3132	307	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.285503	2026-02-24 14:28:25.285503	\N
3133	307	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.287778	2026-02-24 14:28:25.287778	\N
3134	307	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.289951	2026-02-24 14:28:25.289951	\N
3135	373	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.293862	2026-02-24 14:28:25.293862	\N
3136	373	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.296229	2026-02-24 14:28:25.296229	\N
3137	373	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.298393	2026-02-24 14:28:25.298393	\N
3138	373	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.30029	2026-02-24 14:28:25.30029	\N
3139	373	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.302072	2026-02-24 14:28:25.302072	\N
3140	373	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.304178	2026-02-24 14:28:25.304178	\N
3141	373	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.30618	2026-02-24 14:28:25.30618	\N
3142	373	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.309803	2026-02-24 14:28:25.309803	\N
3143	373	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.312235	2026-02-24 14:28:25.312235	\N
3144	373	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.314409	2026-02-24 14:28:25.314409	\N
3145	373	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.316371	2026-02-24 14:28:25.316371	\N
3146	373	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.318427	2026-02-24 14:28:25.318427	\N
3147	374	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.320272	2026-02-24 14:28:25.320272	\N
3148	374	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.322106	2026-02-24 14:28:25.322106	\N
3149	374	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.324516	2026-02-24 14:28:25.324516	\N
3150	374	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.327369	2026-02-24 14:28:25.327369	\N
3151	374	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.329533	2026-02-24 14:28:25.329533	\N
3152	374	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.331442	2026-02-24 14:28:25.331442	\N
3153	374	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.333476	2026-02-24 14:28:25.333476	\N
3154	374	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.335396	2026-02-24 14:28:25.335396	\N
3155	374	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.337474	2026-02-24 14:28:25.337474	\N
3156	374	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.33994	2026-02-24 14:28:25.33994	\N
3157	374	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.343264	2026-02-24 14:28:25.343264	\N
3158	374	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.345463	2026-02-24 14:28:25.345463	\N
3159	375	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.347317	2026-02-24 14:28:25.347317	\N
3160	375	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.349232	2026-02-24 14:28:25.349232	\N
3161	375	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.351266	2026-02-24 14:28:25.351266	\N
3162	375	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.353028	2026-02-24 14:28:25.353028	\N
3163	375	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.354989	2026-02-24 14:28:25.354989	\N
3164	375	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.357083	2026-02-24 14:28:25.357083	\N
3165	375	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.360351	2026-02-24 14:28:25.360351	\N
3166	375	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.362224	2026-02-24 14:28:25.362224	\N
3167	375	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.364261	2026-02-24 14:28:25.364261	\N
3168	375	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.366215	2026-02-24 14:28:25.366215	\N
3169	375	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.367977	2026-02-24 14:28:25.367977	\N
3170	375	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.370025	2026-02-24 14:28:25.370025	\N
3171	376	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.371938	2026-02-24 14:28:25.371938	\N
3172	376	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.373751	2026-02-24 14:28:25.373751	\N
3173	376	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.377081	2026-02-24 14:28:25.377081	\N
3174	376	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.379041	2026-02-24 14:28:25.379041	\N
3175	376	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.38099	2026-02-24 14:28:25.38099	\N
3176	376	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.382749	2026-02-24 14:28:25.382749	\N
3177	376	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.384859	2026-02-24 14:28:25.384859	\N
3178	376	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.386771	2026-02-24 14:28:25.386771	\N
3179	376	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.388543	2026-02-24 14:28:25.388543	\N
3180	376	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.39127	2026-02-24 14:28:25.39127	\N
3181	376	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.393908	2026-02-24 14:28:25.393908	\N
3182	376	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.396325	2026-02-24 14:28:25.396325	\N
3183	377	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.398205	2026-02-24 14:28:25.398205	\N
3184	377	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.400198	2026-02-24 14:28:25.400198	\N
3185	377	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.402221	2026-02-24 14:28:25.402221	\N
3186	377	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.404118	2026-02-24 14:28:25.404118	\N
3187	377	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.406616	2026-02-24 14:28:25.406616	\N
3188	377	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.409952	2026-02-24 14:28:25.409952	\N
3189	377	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.412018	2026-02-24 14:28:25.412018	\N
3190	377	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.413916	2026-02-24 14:28:25.413916	\N
3191	377	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.4166	2026-02-24 14:28:25.4166	\N
3192	377	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.418742	2026-02-24 14:28:25.418742	\N
3193	377	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.421551	2026-02-24 14:28:25.421551	\N
3194	377	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.426005	2026-02-24 14:28:25.426005	\N
3195	378	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.428216	2026-02-24 14:28:25.428216	\N
3196	378	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.430251	2026-02-24 14:28:25.430251	\N
3197	378	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.432101	2026-02-24 14:28:25.432101	\N
3198	378	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.434225	2026-02-24 14:28:25.434225	\N
3199	378	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.436963	2026-02-24 14:28:25.436963	\N
3200	378	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.439013	2026-02-24 14:28:25.439013	\N
3201	378	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.442479	2026-02-24 14:28:25.442479	\N
3202	378	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.445016	2026-02-24 14:28:25.445016	\N
3203	378	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.446988	2026-02-24 14:28:25.446988	\N
3204	378	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.448954	2026-02-24 14:28:25.448954	\N
3205	378	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.450936	2026-02-24 14:28:25.450936	\N
3206	378	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.452783	2026-02-24 14:28:25.452783	\N
3207	379	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.454845	2026-02-24 14:28:25.454845	\N
3208	379	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.456707	2026-02-24 14:28:25.456707	\N
3209	379	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.459924	2026-02-24 14:28:25.459924	\N
3210	379	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.462424	2026-02-24 14:28:25.462424	\N
3211	379	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.46543	2026-02-24 14:28:25.46543	\N
3212	379	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.469101	2026-02-24 14:28:25.469101	\N
3213	379	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.471616	2026-02-24 14:28:25.471616	\N
3214	379	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.477974	2026-02-24 14:28:25.477974	\N
3215	379	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.480266	2026-02-24 14:28:25.480266	\N
3216	379	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.483276	2026-02-24 14:28:25.483276	\N
3217	379	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.485536	2026-02-24 14:28:25.485536	\N
3218	379	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.487766	2026-02-24 14:28:25.487766	\N
3219	380	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.489852	2026-02-24 14:28:25.489852	\N
3220	380	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.493724	2026-02-24 14:28:25.493724	\N
3221	380	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.49607	2026-02-24 14:28:25.49607	\N
3222	380	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.498149	2026-02-24 14:28:25.498149	\N
3223	380	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.500012	2026-02-24 14:28:25.500012	\N
3224	380	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.501951	2026-02-24 14:28:25.501951	\N
3225	380	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.50409	2026-02-24 14:28:25.50409	\N
3226	380	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.506145	2026-02-24 14:28:25.506145	\N
3227	380	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.509163	2026-02-24 14:28:25.509163	\N
3228	380	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.511398	2026-02-24 14:28:25.511398	\N
3229	380	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.513639	2026-02-24 14:28:25.513639	\N
3230	380	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.515612	2026-02-24 14:28:25.515612	\N
3231	381	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.517566	2026-02-24 14:28:25.517566	\N
3232	381	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.519489	2026-02-24 14:28:25.519489	\N
3233	381	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.521392	2026-02-24 14:28:25.521392	\N
3234	381	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.52336	2026-02-24 14:28:25.52336	\N
3235	381	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.526436	2026-02-24 14:28:25.526436	\N
3236	381	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.528712	2026-02-24 14:28:25.528712	\N
3237	381	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.530736	2026-02-24 14:28:25.530736	\N
3238	381	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.53257	2026-02-24 14:28:25.53257	\N
3239	381	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.534719	2026-02-24 14:28:25.534719	\N
3240	381	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.536637	2026-02-24 14:28:25.536637	\N
3241	381	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.538561	2026-02-24 14:28:25.538561	\N
3242	381	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.540618	2026-02-24 14:28:25.540618	\N
3243	382	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.5438	2026-02-24 14:28:25.5438	\N
3244	382	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.546033	2026-02-24 14:28:25.546033	\N
3245	382	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.547917	2026-02-24 14:28:25.547917	\N
3246	382	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.549812	2026-02-24 14:28:25.549812	\N
3247	382	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.551665	2026-02-24 14:28:25.551665	\N
3248	382	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.553738	2026-02-24 14:28:25.553738	\N
3249	382	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.555677	2026-02-24 14:28:25.555677	\N
3250	382	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.558772	2026-02-24 14:28:25.558772	\N
3251	382	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.561148	2026-02-24 14:28:25.561148	\N
3252	382	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.562982	2026-02-24 14:28:25.562982	\N
3253	382	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.565014	2026-02-24 14:28:25.565014	\N
3254	382	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.566808	2026-02-24 14:28:25.566808	\N
3255	383	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.568789	2026-02-24 14:28:25.568789	\N
3256	383	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.57076	2026-02-24 14:28:25.57076	\N
3257	383	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.5725	2026-02-24 14:28:25.5725	\N
3258	383	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.575385	2026-02-24 14:28:25.575385	\N
3259	383	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.577899	2026-02-24 14:28:25.577899	\N
3260	383	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.579933	2026-02-24 14:28:25.579933	\N
3261	383	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.581732	2026-02-24 14:28:25.581732	\N
3262	383	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.583754	2026-02-24 14:28:25.583754	\N
3263	383	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.585719	2026-02-24 14:28:25.585719	\N
3264	383	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.587471	2026-02-24 14:28:25.587471	\N
3265	383	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.589455	2026-02-24 14:28:25.589455	\N
3266	383	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.592448	2026-02-24 14:28:25.592448	\N
3267	385	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.594769	2026-02-24 14:28:25.594769	\N
3268	385	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.596915	2026-02-24 14:28:25.596915	\N
3269	385	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.598742	2026-02-24 14:28:25.598742	\N
3270	385	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.600677	2026-02-24 14:28:25.600677	\N
3271	385	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.602497	2026-02-24 14:28:25.602497	\N
3272	385	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.604543	2026-02-24 14:28:25.604543	\N
3273	385	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.606491	2026-02-24 14:28:25.606491	\N
3274	385	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.609784	2026-02-24 14:28:25.609784	\N
3275	385	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.611857	2026-02-24 14:28:25.611857	\N
3276	385	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.613607	2026-02-24 14:28:25.613607	\N
3277	385	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.615676	2026-02-24 14:28:25.615676	\N
3278	385	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.617679	2026-02-24 14:28:25.617679	\N
3279	386	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.619469	2026-02-24 14:28:25.619469	\N
3280	386	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.621314	2026-02-24 14:28:25.621314	\N
3281	386	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.623303	2026-02-24 14:28:25.623303	\N
3282	386	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.626545	2026-02-24 14:28:25.626545	\N
3283	386	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.628584	2026-02-24 14:28:25.628584	\N
3284	386	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.630543	2026-02-24 14:28:25.630543	\N
3285	386	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.632435	2026-02-24 14:28:25.632435	\N
3286	386	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.634129	2026-02-24 14:28:25.634129	\N
3287	386	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.636397	2026-02-24 14:28:25.636397	\N
3288	386	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.638316	2026-02-24 14:28:25.638316	\N
3289	386	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.640199	2026-02-24 14:28:25.640199	\N
3290	386	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.643351	2026-02-24 14:28:25.643351	\N
3291	387	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.645473	2026-02-24 14:28:25.645473	\N
3292	387	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.647372	2026-02-24 14:28:25.647372	\N
3293	387	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.649192	2026-02-24 14:28:25.649192	\N
3294	387	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.651254	2026-02-24 14:28:25.651254	\N
3295	387	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.653027	2026-02-24 14:28:25.653027	\N
3296	387	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.654856	2026-02-24 14:28:25.654856	\N
3297	387	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.657046	2026-02-24 14:28:25.657046	\N
3298	387	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.660011	2026-02-24 14:28:25.660011	\N
3299	387	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.662331	2026-02-24 14:28:25.662331	\N
3300	387	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.665158	2026-02-24 14:28:25.665158	\N
3301	387	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.66836	2026-02-24 14:28:25.66836	\N
3302	387	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.675057	2026-02-24 14:28:25.675057	\N
3303	388	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.678012	2026-02-24 14:28:25.678012	\N
3304	388	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.680418	2026-02-24 14:28:25.680418	\N
3305	388	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.683025	2026-02-24 14:28:25.683025	\N
3306	388	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.685762	2026-02-24 14:28:25.685762	\N
3307	388	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.688367	2026-02-24 14:28:25.688367	\N
3308	388	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.692024	2026-02-24 14:28:25.692024	\N
3309	388	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.695306	2026-02-24 14:28:25.695306	\N
3310	388	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.697336	2026-02-24 14:28:25.697336	\N
3311	388	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.699169	2026-02-24 14:28:25.699169	\N
3312	388	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.701027	2026-02-24 14:28:25.701027	\N
3313	388	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.703031	2026-02-24 14:28:25.703031	\N
3314	388	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.705276	2026-02-24 14:28:25.705276	\N
3315	389	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.707364	2026-02-24 14:28:25.707364	\N
3316	389	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.710478	2026-02-24 14:28:25.710478	\N
3317	389	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.712352	2026-02-24 14:28:25.712352	\N
3318	389	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.714138	2026-02-24 14:28:25.714138	\N
3319	389	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.716077	2026-02-24 14:28:25.716077	\N
3320	389	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.718123	2026-02-24 14:28:25.718123	\N
3321	389	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.720063	2026-02-24 14:28:25.720063	\N
3322	389	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.721904	2026-02-24 14:28:25.721904	\N
3323	389	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.723741	2026-02-24 14:28:25.723741	\N
3324	389	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.727272	2026-02-24 14:28:25.727272	\N
3325	389	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.729263	2026-02-24 14:28:25.729263	\N
3326	389	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.731152	2026-02-24 14:28:25.731152	\N
3327	390	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.73341	2026-02-24 14:28:25.73341	\N
3328	390	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.736213	2026-02-24 14:28:25.736213	\N
3329	390	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.738451	2026-02-24 14:28:25.738451	\N
3330	390	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.740511	2026-02-24 14:28:25.740511	\N
3331	390	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.743593	2026-02-24 14:28:25.743593	\N
3332	390	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.745814	2026-02-24 14:28:25.745814	\N
3333	390	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.747804	2026-02-24 14:28:25.747804	\N
3334	390	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.749557	2026-02-24 14:28:25.749557	\N
3335	390	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.751503	2026-02-24 14:28:25.751503	\N
3336	390	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.753324	2026-02-24 14:28:25.753324	\N
3337	390	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.755133	2026-02-24 14:28:25.755133	\N
3338	390	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.75708	2026-02-24 14:28:25.75708	\N
3339	391	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.760015	2026-02-24 14:28:25.760015	\N
3340	391	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.762041	2026-02-24 14:28:25.762041	\N
3341	391	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.763765	2026-02-24 14:28:25.763765	\N
3342	391	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.76574	2026-02-24 14:28:25.76574	\N
3343	391	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.767528	2026-02-24 14:28:25.767528	\N
3344	391	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.769279	2026-02-24 14:28:25.769279	\N
3345	391	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.77117	2026-02-24 14:28:25.77117	\N
3346	391	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.773066	2026-02-24 14:28:25.773066	\N
3347	391	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.776306	2026-02-24 14:28:25.776306	\N
3348	391	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.778316	2026-02-24 14:28:25.778316	\N
3349	391	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.780207	2026-02-24 14:28:25.780207	\N
3350	391	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.782115	2026-02-24 14:28:25.782115	\N
3351	392	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.783875	2026-02-24 14:28:25.783875	\N
3352	392	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.785924	2026-02-24 14:28:25.785924	\N
3353	392	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.787771	2026-02-24 14:28:25.787771	\N
3354	392	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.789503	2026-02-24 14:28:25.789503	\N
3355	392	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.792283	2026-02-24 14:28:25.792283	\N
3356	392	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.794581	2026-02-24 14:28:25.794581	\N
3357	392	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.79666	2026-02-24 14:28:25.79666	\N
3358	392	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.798413	2026-02-24 14:28:25.798413	\N
3359	392	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.800242	2026-02-24 14:28:25.800242	\N
3360	392	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.802162	2026-02-24 14:28:25.802162	\N
3361	392	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.803895	2026-02-24 14:28:25.803895	\N
3362	392	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.805913	2026-02-24 14:28:25.805913	\N
3363	393	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.808751	2026-02-24 14:28:25.808751	\N
3364	393	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.811412	2026-02-24 14:28:25.811412	\N
3365	393	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.813288	2026-02-24 14:28:25.813288	\N
3366	393	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.815074	2026-02-24 14:28:25.815074	\N
3367	393	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.817033	2026-02-24 14:28:25.817033	\N
3368	393	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.818834	2026-02-24 14:28:25.818834	\N
3369	393	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.820776	2026-02-24 14:28:25.820776	\N
3370	393	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.822578	2026-02-24 14:28:25.822578	\N
3371	393	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.825168	2026-02-24 14:28:25.825168	\N
3372	393	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.828462	2026-02-24 14:28:25.828462	\N
3373	393	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.830482	2026-02-24 14:28:25.830482	\N
3374	393	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.832386	2026-02-24 14:28:25.832386	\N
3375	394	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.834156	2026-02-24 14:28:25.834156	\N
3376	394	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.836164	2026-02-24 14:28:25.836164	\N
3377	394	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.838005	2026-02-24 14:28:25.838005	\N
3378	394	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.839936	2026-02-24 14:28:25.839936	\N
3379	394	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.843235	2026-02-24 14:28:25.843235	\N
3380	394	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.845428	2026-02-24 14:28:25.845428	\N
3381	394	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.847377	2026-02-24 14:28:25.847377	\N
3382	394	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.849089	2026-02-24 14:28:25.849089	\N
3383	394	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.851124	2026-02-24 14:28:25.851124	\N
3384	394	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.852967	2026-02-24 14:28:25.852967	\N
3385	394	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.854715	2026-02-24 14:28:25.854715	\N
3386	394	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.85676	2026-02-24 14:28:25.85676	\N
3387	395	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.859725	2026-02-24 14:28:25.859725	\N
3388	395	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.861932	2026-02-24 14:28:25.861932	\N
3389	395	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.864285	2026-02-24 14:28:25.864285	\N
3390	395	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.86702	2026-02-24 14:28:25.86702	\N
3391	395	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.869432	2026-02-24 14:28:25.869432	\N
3392	395	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.874219	2026-02-24 14:28:25.874219	\N
3393	395	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.877655	2026-02-24 14:28:25.877655	\N
3394	395	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.880756	2026-02-24 14:28:25.880756	\N
3395	395	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.884144	2026-02-24 14:28:25.884144	\N
3396	395	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.886767	2026-02-24 14:28:25.886767	\N
3397	395	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.88905	2026-02-24 14:28:25.88905	\N
3398	395	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.892431	2026-02-24 14:28:25.892431	\N
3399	397	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.895208	2026-02-24 14:28:25.895208	\N
3400	397	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.897263	2026-02-24 14:28:25.897263	\N
3401	397	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.899162	2026-02-24 14:28:25.899162	\N
3402	397	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.900924	2026-02-24 14:28:25.900924	\N
3403	397	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.902902	2026-02-24 14:28:25.902902	\N
3404	397	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.904778	2026-02-24 14:28:25.904778	\N
3405	397	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.906556	2026-02-24 14:28:25.906556	\N
3406	397	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.909502	2026-02-24 14:28:25.909502	\N
3407	397	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.911435	2026-02-24 14:28:25.911435	\N
3408	397	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.913358	2026-02-24 14:28:25.913358	\N
3409	397	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.915169	2026-02-24 14:28:25.915169	\N
3410	397	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.916981	2026-02-24 14:28:25.916981	\N
3411	398	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.919052	2026-02-24 14:28:25.919052	\N
3412	398	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.920848	2026-02-24 14:28:25.920848	\N
3413	398	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.92271	2026-02-24 14:28:25.92271	\N
3414	398	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.925562	2026-02-24 14:28:25.925562	\N
3415	398	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.927972	2026-02-24 14:28:25.927972	\N
3416	398	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.929889	2026-02-24 14:28:25.929889	\N
3417	398	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.931719	2026-02-24 14:28:25.931719	\N
3418	398	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.934056	2026-02-24 14:28:25.934056	\N
3419	398	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.936102	2026-02-24 14:28:25.936102	\N
3420	398	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.938223	2026-02-24 14:28:25.938223	\N
3421	398	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.940088	2026-02-24 14:28:25.940088	\N
3422	398	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.943235	2026-02-24 14:28:25.943235	\N
3423	399	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.945275	2026-02-24 14:28:25.945275	\N
3424	399	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.947437	2026-02-24 14:28:25.947437	\N
3425	399	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.950154	2026-02-24 14:28:25.950154	\N
3426	399	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.95207	2026-02-24 14:28:25.95207	\N
3427	399	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.954291	2026-02-24 14:28:25.954291	\N
3428	399	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.95642	2026-02-24 14:28:25.95642	\N
3429	399	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.959672	2026-02-24 14:28:25.959672	\N
3430	399	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.961741	2026-02-24 14:28:25.961741	\N
3431	399	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.963834	2026-02-24 14:28:25.963834	\N
3432	399	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.965858	2026-02-24 14:28:25.965858	\N
3433	399	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.967639	2026-02-24 14:28:25.967639	\N
3434	399	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.969709	2026-02-24 14:28:25.969709	\N
3435	400	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.971535	2026-02-24 14:28:25.971535	\N
3436	400	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.973298	2026-02-24 14:28:25.973298	\N
3437	400	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:25.976341	2026-02-24 14:28:25.976341	\N
3438	400	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:25.978346	2026-02-24 14:28:25.978346	\N
3439	400	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:25.980395	2026-02-24 14:28:25.980395	\N
3440	400	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:25.982197	2026-02-24 14:28:25.982197	\N
3441	400	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:25.984129	2026-02-24 14:28:25.984129	\N
3442	400	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:25.986091	2026-02-24 14:28:25.986091	\N
3443	400	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:25.987857	2026-02-24 14:28:25.987857	\N
3444	400	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:25.98974	2026-02-24 14:28:25.98974	\N
3445	400	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:25.992644	2026-02-24 14:28:25.992644	\N
3446	400	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:25.994894	2026-02-24 14:28:25.994894	\N
3447	401	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:25.996776	2026-02-24 14:28:25.996776	\N
3448	401	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:25.998811	2026-02-24 14:28:25.998811	\N
3449	401	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.000581	2026-02-24 14:28:26.000581	\N
3450	401	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.002314	2026-02-24 14:28:26.002314	\N
3451	401	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.004379	2026-02-24 14:28:26.004379	\N
3452	401	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.006289	2026-02-24 14:28:26.006289	\N
3453	401	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.009215	2026-02-24 14:28:26.009215	\N
3454	401	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.011373	2026-02-24 14:28:26.011373	\N
3455	401	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.013243	2026-02-24 14:28:26.013243	\N
3456	401	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.015104	2026-02-24 14:28:26.015104	\N
3457	401	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.016944	2026-02-24 14:28:26.016944	\N
3458	401	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.018995	2026-02-24 14:28:26.018995	\N
3459	402	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.020777	2026-02-24 14:28:26.020777	\N
3460	402	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.022478	2026-02-24 14:28:26.022478	\N
3461	402	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.025131	2026-02-24 14:28:26.025131	\N
3462	402	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.027479	2026-02-24 14:28:26.027479	\N
3463	402	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.02946	2026-02-24 14:28:26.02946	\N
3464	402	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.031213	2026-02-24 14:28:26.031213	\N
3465	402	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.032962	2026-02-24 14:28:26.032962	\N
3466	402	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.034917	2026-02-24 14:28:26.034917	\N
3467	402	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.036747	2026-02-24 14:28:26.036747	\N
3468	402	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.038667	2026-02-24 14:28:26.038667	\N
3469	402	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.040566	2026-02-24 14:28:26.040566	\N
3470	402	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.043667	2026-02-24 14:28:26.043667	\N
3471	403	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.045706	2026-02-24 14:28:26.045706	\N
3472	403	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.047481	2026-02-24 14:28:26.047481	\N
3473	403	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.049416	2026-02-24 14:28:26.049416	\N
3474	403	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.051197	2026-02-24 14:28:26.051197	\N
3475	403	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.05289	2026-02-24 14:28:26.05289	\N
3476	403	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.054736	2026-02-24 14:28:26.054736	\N
3477	403	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.056553	2026-02-24 14:28:26.056553	\N
3478	403	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.059936	2026-02-24 14:28:26.059936	\N
3479	403	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.062156	2026-02-24 14:28:26.062156	\N
3480	403	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.064641	2026-02-24 14:28:26.064641	\N
3481	403	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.067013	2026-02-24 14:28:26.067013	\N
3482	403	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.074672	2026-02-24 14:28:26.074672	\N
3483	404	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.07766	2026-02-24 14:28:26.07766	\N
3484	404	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.080049	2026-02-24 14:28:26.080049	\N
3485	404	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.082151	2026-02-24 14:28:26.082151	\N
3486	404	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.084522	2026-02-24 14:28:26.084522	\N
3487	404	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.0865	2026-02-24 14:28:26.0865	\N
3488	404	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.088807	2026-02-24 14:28:26.088807	\N
3489	404	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.091879	2026-02-24 14:28:26.091879	\N
3490	404	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.094715	2026-02-24 14:28:26.094715	\N
3491	404	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.096698	2026-02-24 14:28:26.096698	\N
3492	404	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.098462	2026-02-24 14:28:26.098462	\N
3493	404	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.10032	2026-02-24 14:28:26.10032	\N
3494	404	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.102078	2026-02-24 14:28:26.102078	\N
3495	405	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.103812	2026-02-24 14:28:26.103812	\N
3496	405	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.10584	2026-02-24 14:28:26.10584	\N
3497	405	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.108493	2026-02-24 14:28:26.108493	\N
3498	405	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.110936	2026-02-24 14:28:26.110936	\N
3499	405	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.112797	2026-02-24 14:28:26.112797	\N
3500	405	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.114526	2026-02-24 14:28:26.114526	\N
3501	405	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.116565	2026-02-24 14:28:26.116565	\N
3502	405	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.118639	2026-02-24 14:28:26.118639	\N
3503	405	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.120853	2026-02-24 14:28:26.120853	\N
3504	405	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.123033	2026-02-24 14:28:26.123033	\N
3505	405	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.126384	2026-02-24 14:28:26.126384	\N
3506	405	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.128362	2026-02-24 14:28:26.128362	\N
3507	406	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.130265	2026-02-24 14:28:26.130265	\N
3508	406	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.132261	2026-02-24 14:28:26.132261	\N
3509	406	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.134063	2026-02-24 14:28:26.134063	\N
3510	406	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.136315	2026-02-24 14:28:26.136315	\N
3511	406	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.138153	2026-02-24 14:28:26.138153	\N
3512	406	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.139856	2026-02-24 14:28:26.139856	\N
3513	406	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.142854	2026-02-24 14:28:26.142854	\N
3514	406	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.144859	2026-02-24 14:28:26.144859	\N
3515	406	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.146792	2026-02-24 14:28:26.146792	\N
3516	406	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.148607	2026-02-24 14:28:26.148607	\N
3517	406	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.150424	2026-02-24 14:28:26.150424	\N
3518	406	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.152258	2026-02-24 14:28:26.152258	\N
3519	407	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.153988	2026-02-24 14:28:26.153988	\N
3520	407	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.15599	2026-02-24 14:28:26.15599	\N
3521	407	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.158524	2026-02-24 14:28:26.158524	\N
3522	407	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.160893	2026-02-24 14:28:26.160893	\N
3523	407	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.162692	2026-02-24 14:28:26.162692	\N
3524	407	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.164403	2026-02-24 14:28:26.164403	\N
3525	407	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.166428	2026-02-24 14:28:26.166428	\N
3526	407	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.168258	2026-02-24 14:28:26.168258	\N
3527	407	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.169992	2026-02-24 14:28:26.169992	\N
3528	407	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.1719	2026-02-24 14:28:26.1719	\N
3529	407	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.173629	2026-02-24 14:28:26.173629	\N
3530	407	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.176747	2026-02-24 14:28:26.176747	\N
3531	491	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.178835	2026-02-24 14:28:26.178835	\N
3532	491	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.180887	2026-02-24 14:28:26.180887	\N
3533	491	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.182811	2026-02-24 14:28:26.182811	\N
3534	491	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.184562	2026-02-24 14:28:26.184562	\N
3535	491	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.186495	2026-02-24 14:28:26.186495	\N
3536	491	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.188259	2026-02-24 14:28:26.188259	\N
3537	491	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.189987	2026-02-24 14:28:26.189987	\N
3538	491	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.193214	2026-02-24 14:28:26.193214	\N
3539	491	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.195149	2026-02-24 14:28:26.195149	\N
3540	491	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.197237	2026-02-24 14:28:26.197237	\N
3541	491	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.199062	2026-02-24 14:28:26.199062	\N
3542	491	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.200916	2026-02-24 14:28:26.200916	\N
3543	492	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.202696	2026-02-24 14:28:26.202696	\N
3544	492	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.20442	2026-02-24 14:28:26.20442	\N
3545	492	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.206381	2026-02-24 14:28:26.206381	\N
3546	492	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.209179	2026-02-24 14:28:26.209179	\N
3547	492	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.211561	2026-02-24 14:28:26.211561	\N
3548	492	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.213419	2026-02-24 14:28:26.213419	\N
3549	492	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.215335	2026-02-24 14:28:26.215335	\N
3550	492	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.217268	2026-02-24 14:28:26.217268	\N
3551	492	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.219404	2026-02-24 14:28:26.219404	\N
3552	492	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.221935	2026-02-24 14:28:26.221935	\N
3553	492	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.225199	2026-02-24 14:28:26.225199	\N
3554	492	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.227986	2026-02-24 14:28:26.227986	\N
3555	493	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.22984	2026-02-24 14:28:26.22984	\N
3556	493	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.231547	2026-02-24 14:28:26.231547	\N
3557	493	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.233754	2026-02-24 14:28:26.233754	\N
3558	493	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.235676	2026-02-24 14:28:26.235676	\N
3559	493	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.237569	2026-02-24 14:28:26.237569	\N
3560	493	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.239352	2026-02-24 14:28:26.239352	\N
3561	493	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.241706	2026-02-24 14:28:26.241706	\N
3562	493	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.244571	2026-02-24 14:28:26.244571	\N
3563	493	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.24684	2026-02-24 14:28:26.24684	\N
3564	493	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.249137	2026-02-24 14:28:26.249137	\N
3565	493	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.251069	2026-02-24 14:28:26.251069	\N
3566	493	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.253002	2026-02-24 14:28:26.253002	\N
3567	494	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.254892	2026-02-24 14:28:26.254892	\N
3568	494	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.256761	2026-02-24 14:28:26.256761	\N
3569	494	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.259712	2026-02-24 14:28:26.259712	\N
3570	494	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.261654	2026-02-24 14:28:26.261654	\N
3571	494	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.263861	2026-02-24 14:28:26.263861	\N
3572	494	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.26642	2026-02-24 14:28:26.26642	\N
3573	494	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.268891	2026-02-24 14:28:26.268891	\N
3574	494	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.276224	2026-02-24 14:28:26.276224	\N
3575	494	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.278585	2026-02-24 14:28:26.278585	\N
3576	494	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.280955	2026-02-24 14:28:26.280955	\N
3577	494	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.283066	2026-02-24 14:28:26.283066	\N
3578	494	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.285089	2026-02-24 14:28:26.285089	\N
3579	495	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.287224	2026-02-24 14:28:26.287224	\N
3580	495	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.289166	2026-02-24 14:28:26.289166	\N
3581	495	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.292764	2026-02-24 14:28:26.292764	\N
3582	495	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.295139	2026-02-24 14:28:26.295139	\N
3583	495	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.297148	2026-02-24 14:28:26.297148	\N
3584	495	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.298941	2026-02-24 14:28:26.298941	\N
3585	495	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.300945	2026-02-24 14:28:26.300945	\N
3586	495	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.302776	2026-02-24 14:28:26.302776	\N
3587	495	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.304519	2026-02-24 14:28:26.304519	\N
3588	495	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.306522	2026-02-24 14:28:26.306522	\N
3589	495	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.309449	2026-02-24 14:28:26.309449	\N
3590	495	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.311453	2026-02-24 14:28:26.311453	\N
3591	496	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.313283	2026-02-24 14:28:26.313283	\N
3592	496	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.315191	2026-02-24 14:28:26.315191	\N
3593	496	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.317371	2026-02-24 14:28:26.317371	\N
3594	496	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.319255	2026-02-24 14:28:26.319255	\N
3595	496	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.320964	2026-02-24 14:28:26.320964	\N
3596	496	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.322881	2026-02-24 14:28:26.322881	\N
3597	496	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.325808	2026-02-24 14:28:26.325808	\N
3598	496	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.327987	2026-02-24 14:28:26.327987	\N
3599	496	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.329733	2026-02-24 14:28:26.329733	\N
3600	496	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.331642	2026-02-24 14:28:26.331642	\N
3601	496	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.333902	2026-02-24 14:28:26.333902	\N
3602	496	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.337772	2026-02-24 14:28:26.337772	\N
3603	497	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.342266	2026-02-24 14:28:26.342266	\N
3604	497	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.345602	2026-02-24 14:28:26.345602	\N
3605	497	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.349655	2026-02-24 14:28:26.349655	\N
3606	497	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.353263	2026-02-24 14:28:26.353263	\N
3607	497	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.356553	2026-02-24 14:28:26.356553	\N
3608	497	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.360115	2026-02-24 14:28:26.360115	\N
3609	497	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.361966	2026-02-24 14:28:26.361966	\N
3610	497	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.36394	2026-02-24 14:28:26.36394	\N
3611	497	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.365882	2026-02-24 14:28:26.365882	\N
3612	497	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.367576	2026-02-24 14:28:26.367576	\N
3613	497	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.369424	2026-02-24 14:28:26.369424	\N
3614	497	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.371138	2026-02-24 14:28:26.371138	\N
3615	498	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.372789	2026-02-24 14:28:26.372789	\N
3616	498	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.375766	2026-02-24 14:28:26.375766	\N
3617	498	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.377781	2026-02-24 14:28:26.377781	\N
3618	498	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.379678	2026-02-24 14:28:26.379678	\N
3619	498	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.381418	2026-02-24 14:28:26.381418	\N
3620	498	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.383192	2026-02-24 14:28:26.383192	\N
3621	498	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.385034	2026-02-24 14:28:26.385034	\N
3622	498	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.386805	2026-02-24 14:28:26.386805	\N
3623	498	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.38877	2026-02-24 14:28:26.38877	\N
3624	498	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.390673	2026-02-24 14:28:26.390673	\N
3625	498	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.393595	2026-02-24 14:28:26.393595	\N
3626	498	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.395699	2026-02-24 14:28:26.395699	\N
3627	499	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.397476	2026-02-24 14:28:26.397476	\N
3628	499	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.399351	2026-02-24 14:28:26.399351	\N
3629	499	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.401112	2026-02-24 14:28:26.401112	\N
3630	499	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.402806	2026-02-24 14:28:26.402806	\N
3631	499	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.40462	2026-02-24 14:28:26.40462	\N
3632	499	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.406621	2026-02-24 14:28:26.406621	\N
3633	499	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.409776	2026-02-24 14:28:26.409776	\N
3634	499	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.411806	2026-02-24 14:28:26.411806	\N
3635	499	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.413758	2026-02-24 14:28:26.413758	\N
3636	499	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.415654	2026-02-24 14:28:26.415654	\N
3637	499	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.417432	2026-02-24 14:28:26.417432	\N
3638	499	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.419322	2026-02-24 14:28:26.419322	\N
3639	500	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.421078	2026-02-24 14:28:26.421078	\N
3640	500	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.422761	2026-02-24 14:28:26.422761	\N
3641	500	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.425772	2026-02-24 14:28:26.425772	\N
3642	500	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.427896	2026-02-24 14:28:26.427896	\N
3643	500	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.429766	2026-02-24 14:28:26.429766	\N
3644	500	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.431517	2026-02-24 14:28:26.431517	\N
3645	500	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.433279	2026-02-24 14:28:26.433279	\N
3646	500	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.435808	2026-02-24 14:28:26.435808	\N
3647	500	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.437978	2026-02-24 14:28:26.437978	\N
3648	500	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.439918	2026-02-24 14:28:26.439918	\N
3649	500	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.443029	2026-02-24 14:28:26.443029	\N
3650	500	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.445104	2026-02-24 14:28:26.445104	\N
3651	501	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.446863	2026-02-24 14:28:26.446863	\N
3652	501	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.44908	2026-02-24 14:28:26.44908	\N
3653	501	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.451001	2026-02-24 14:28:26.451001	\N
3654	501	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.452869	2026-02-24 14:28:26.452869	\N
3655	501	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.455049	2026-02-24 14:28:26.455049	\N
3656	501	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.456969	2026-02-24 14:28:26.456969	\N
3657	501	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.459875	2026-02-24 14:28:26.459875	\N
3658	501	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.46177	2026-02-24 14:28:26.46177	\N
3659	501	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.463777	2026-02-24 14:28:26.463777	\N
3660	501	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.466236	2026-02-24 14:28:26.466236	\N
3661	501	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.46838	2026-02-24 14:28:26.46838	\N
3662	501	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.475499	2026-02-24 14:28:26.475499	\N
3663	502	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.478066	2026-02-24 14:28:26.478066	\N
3664	502	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.480122	2026-02-24 14:28:26.480122	\N
3665	502	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.482149	2026-02-24 14:28:26.482149	\N
3666	502	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.484302	2026-02-24 14:28:26.484302	\N
3667	502	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.486121	2026-02-24 14:28:26.486121	\N
3668	502	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.488329	2026-02-24 14:28:26.488329	\N
3669	502	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.490343	2026-02-24 14:28:26.490343	\N
3670	502	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.494072	2026-02-24 14:28:26.494072	\N
3671	502	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.496051	2026-02-24 14:28:26.496051	\N
3672	502	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.497852	2026-02-24 14:28:26.497852	\N
3673	502	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.499792	2026-02-24 14:28:26.499792	\N
3674	502	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.501556	2026-02-24 14:28:26.501556	\N
3675	503	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.50333	2026-02-24 14:28:26.50333	\N
3676	503	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.5053	2026-02-24 14:28:26.5053	\N
3677	503	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.507045	2026-02-24 14:28:26.507045	\N
3678	503	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.509976	2026-02-24 14:28:26.509976	\N
3679	503	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.5118	2026-02-24 14:28:26.5118	\N
3680	503	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.513449	2026-02-24 14:28:26.513449	\N
3681	503	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.515248	2026-02-24 14:28:26.515248	\N
3682	503	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.517027	2026-02-24 14:28:26.517027	\N
3683	503	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.518729	2026-02-24 14:28:26.518729	\N
3684	503	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.520814	2026-02-24 14:28:26.520814	\N
3685	503	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.52256	2026-02-24 14:28:26.52256	\N
3686	503	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.524956	2026-02-24 14:28:26.524956	\N
3687	504	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.527423	2026-02-24 14:28:26.527423	\N
3688	504	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.529326	2026-02-24 14:28:26.529326	\N
3689	504	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.531158	2026-02-24 14:28:26.531158	\N
3690	504	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.532878	2026-02-24 14:28:26.532878	\N
3691	504	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.534833	2026-02-24 14:28:26.534833	\N
3692	504	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.536814	2026-02-24 14:28:26.536814	\N
3693	504	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.538634	2026-02-24 14:28:26.538634	\N
3694	504	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.540609	2026-02-24 14:28:26.540609	\N
3695	504	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.543339	2026-02-24 14:28:26.543339	\N
3696	504	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.545432	2026-02-24 14:28:26.545432	\N
3697	504	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.547214	2026-02-24 14:28:26.547214	\N
3698	504	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.548975	2026-02-24 14:28:26.548975	\N
3699	505	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.55087	2026-02-24 14:28:26.55087	\N
3700	505	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.55258	2026-02-24 14:28:26.55258	\N
3701	505	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.554435	2026-02-24 14:28:26.554435	\N
3702	505	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.556312	2026-02-24 14:28:26.556312	\N
3703	505	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.559253	2026-02-24 14:28:26.559253	\N
3704	505	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.561483	2026-02-24 14:28:26.561483	\N
3705	505	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.563237	2026-02-24 14:28:26.563237	\N
3706	505	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.565136	2026-02-24 14:28:26.565136	\N
3707	505	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.566928	2026-02-24 14:28:26.566928	\N
3708	505	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.568659	2026-02-24 14:28:26.568659	\N
3709	505	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.570528	2026-02-24 14:28:26.570528	\N
3710	505	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.572218	2026-02-24 14:28:26.572218	\N
3711	506	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.573957	2026-02-24 14:28:26.573957	\N
3712	506	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.577065	2026-02-24 14:28:26.577065	\N
3713	506	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.579056	2026-02-24 14:28:26.579056	\N
3714	506	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.580959	2026-02-24 14:28:26.580959	\N
3715	506	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.582867	2026-02-24 14:28:26.582867	\N
3716	506	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.58478	2026-02-24 14:28:26.58478	\N
3717	506	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.586577	2026-02-24 14:28:26.586577	\N
3718	506	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.588211	2026-02-24 14:28:26.588211	\N
3719	506	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.590163	2026-02-24 14:28:26.590163	\N
3720	506	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.593261	2026-02-24 14:28:26.593261	\N
3721	506	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.595415	2026-02-24 14:28:26.595415	\N
3722	506	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.597398	2026-02-24 14:28:26.597398	\N
3723	507	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.599195	2026-02-24 14:28:26.599195	\N
3724	507	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.600987	2026-02-24 14:28:26.600987	\N
3725	507	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.602703	2026-02-24 14:28:26.602703	\N
3726	507	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.604494	2026-02-24 14:28:26.604494	\N
3727	507	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.606278	2026-02-24 14:28:26.606278	\N
3728	507	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.609024	2026-02-24 14:28:26.609024	\N
3729	507	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.611208	2026-02-24 14:28:26.611208	\N
3730	507	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.613092	2026-02-24 14:28:26.613092	\N
3731	507	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.615008	2026-02-24 14:28:26.615008	\N
3732	507	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.616903	2026-02-24 14:28:26.616903	\N
3733	507	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.618621	2026-02-24 14:28:26.618621	\N
3734	507	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.620452	2026-02-24 14:28:26.620452	\N
3735	508	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.622187	2026-02-24 14:28:26.622187	\N
3736	508	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.623936	2026-02-24 14:28:26.623936	\N
3737	508	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.626947	2026-02-24 14:28:26.626947	\N
3738	508	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.628885	2026-02-24 14:28:26.628885	\N
3739	508	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.630892	2026-02-24 14:28:26.630892	\N
3740	508	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.632584	2026-02-24 14:28:26.632584	\N
3741	508	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.634526	2026-02-24 14:28:26.634526	\N
3742	508	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.636423	2026-02-24 14:28:26.636423	\N
3743	508	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.638101	2026-02-24 14:28:26.638101	\N
3744	508	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.639906	2026-02-24 14:28:26.639906	\N
3745	508	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.642899	2026-02-24 14:28:26.642899	\N
3746	508	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.645086	2026-02-24 14:28:26.645086	\N
3747	509	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.646913	2026-02-24 14:28:26.646913	\N
3748	509	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.648615	2026-02-24 14:28:26.648615	\N
3749	509	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.65044	2026-02-24 14:28:26.65044	\N
3750	509	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.65217	2026-02-24 14:28:26.65217	\N
3751	509	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.653892	2026-02-24 14:28:26.653892	\N
3752	509	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.655949	2026-02-24 14:28:26.655949	\N
3753	509	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.658474	2026-02-24 14:28:26.658474	\N
3754	509	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.660923	2026-02-24 14:28:26.660923	\N
3755	509	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.662835	2026-02-24 14:28:26.662835	\N
3756	509	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.665186	2026-02-24 14:28:26.665186	\N
3757	509	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.667484	2026-02-24 14:28:26.667484	\N
3758	509	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.669544	2026-02-24 14:28:26.669544	\N
3759	510	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.676108	2026-02-24 14:28:26.676108	\N
3760	510	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.678712	2026-02-24 14:28:26.678712	\N
3761	510	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.681342	2026-02-24 14:28:26.681342	\N
3762	510	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.683658	2026-02-24 14:28:26.683658	\N
3763	510	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.685641	2026-02-24 14:28:26.685641	\N
3764	510	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.68768	2026-02-24 14:28:26.68768	\N
3765	510	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.689647	2026-02-24 14:28:26.689647	\N
3766	510	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.693177	2026-02-24 14:28:26.693177	\N
3767	510	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.69504	2026-02-24 14:28:26.69504	\N
3768	510	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.697025	2026-02-24 14:28:26.697025	\N
3769	510	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.698857	2026-02-24 14:28:26.698857	\N
3770	510	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.700595	2026-02-24 14:28:26.700595	\N
3771	511	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.702703	2026-02-24 14:28:26.702703	\N
3772	511	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.70448	2026-02-24 14:28:26.70448	\N
3773	511	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.70637	2026-02-24 14:28:26.70637	\N
3774	511	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.709313	2026-02-24 14:28:26.709313	\N
3775	511	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.711347	2026-02-24 14:28:26.711347	\N
3776	511	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.713164	2026-02-24 14:28:26.713164	\N
3777	511	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.714876	2026-02-24 14:28:26.714876	\N
3778	511	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.716737	2026-02-24 14:28:26.716737	\N
3779	511	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.718575	2026-02-24 14:28:26.718575	\N
3780	511	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.720273	2026-02-24 14:28:26.720273	\N
3781	511	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.722261	2026-02-24 14:28:26.722261	\N
3782	511	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.724571	2026-02-24 14:28:26.724571	\N
3783	512	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.727359	2026-02-24 14:28:26.727359	\N
3784	512	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.72924	2026-02-24 14:28:26.72924	\N
3785	512	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.730925	2026-02-24 14:28:26.730925	\N
3786	512	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.732851	2026-02-24 14:28:26.732851	\N
3787	512	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.734542	2026-02-24 14:28:26.734542	\N
3788	512	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.736474	2026-02-24 14:28:26.736474	\N
3789	512	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.738373	2026-02-24 14:28:26.738373	\N
3790	512	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.740052	2026-02-24 14:28:26.740052	\N
3791	512	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.743105	2026-02-24 14:28:26.743105	\N
3792	512	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.745324	2026-02-24 14:28:26.745324	\N
3793	512	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.747424	2026-02-24 14:28:26.747424	\N
3794	512	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.749367	2026-02-24 14:28:26.749367	\N
3795	513	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.751093	2026-02-24 14:28:26.751093	\N
3796	513	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.752986	2026-02-24 14:28:26.752986	\N
3797	513	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.755389	2026-02-24 14:28:26.755389	\N
3798	513	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.75892	2026-02-24 14:28:26.75892	\N
3799	513	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.761586	2026-02-24 14:28:26.761586	\N
3800	513	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.763639	2026-02-24 14:28:26.763639	\N
3801	513	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.76544	2026-02-24 14:28:26.76544	\N
3802	513	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.767193	2026-02-24 14:28:26.767193	\N
3803	513	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.76921	2026-02-24 14:28:26.76921	\N
3804	513	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.771084	2026-02-24 14:28:26.771084	\N
3805	513	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.772816	2026-02-24 14:28:26.772816	\N
3806	513	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.776008	2026-02-24 14:28:26.776008	\N
3807	514	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.778119	2026-02-24 14:28:26.778119	\N
3808	514	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.780017	2026-02-24 14:28:26.780017	\N
3809	514	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.781724	2026-02-24 14:28:26.781724	\N
3810	514	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.783678	2026-02-24 14:28:26.783678	\N
3811	514	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.785561	2026-02-24 14:28:26.785561	\N
3812	514	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.787317	2026-02-24 14:28:26.787317	\N
3813	514	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.789147	2026-02-24 14:28:26.789147	\N
3814	514	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.79149	2026-02-24 14:28:26.79149	\N
3815	514	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.794114	2026-02-24 14:28:26.794114	\N
3816	514	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.796085	2026-02-24 14:28:26.796085	\N
3817	514	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.797828	2026-02-24 14:28:26.797828	\N
3818	514	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.799693	2026-02-24 14:28:26.799693	\N
3819	515	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.801734	2026-02-24 14:28:26.801734	\N
3820	515	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.80364	2026-02-24 14:28:26.80364	\N
3821	515	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.805431	2026-02-24 14:28:26.805431	\N
3822	515	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.807197	2026-02-24 14:28:26.807197	\N
3823	515	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.810119	2026-02-24 14:28:26.810119	\N
3824	515	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.812004	2026-02-24 14:28:26.812004	\N
3825	515	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.81368	2026-02-24 14:28:26.81368	\N
3826	515	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.815587	2026-02-24 14:28:26.815587	\N
3827	515	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.817532	2026-02-24 14:28:26.817532	\N
3828	515	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.819352	2026-02-24 14:28:26.819352	\N
3829	515	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.821255	2026-02-24 14:28:26.821255	\N
3830	515	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.822938	2026-02-24 14:28:26.822938	\N
3831	516	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.825776	2026-02-24 14:28:26.825776	\N
3832	516	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.828055	2026-02-24 14:28:26.828055	\N
3833	516	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.82999	2026-02-24 14:28:26.82999	\N
3834	516	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.831761	2026-02-24 14:28:26.831761	\N
3835	516	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.839031	2026-02-24 14:28:26.839031	\N
3836	516	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.841575	2026-02-24 14:28:26.841575	\N
3837	516	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.844078	2026-02-24 14:28:26.844078	\N
3838	516	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.846079	2026-02-24 14:28:26.846079	\N
3839	516	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.847866	2026-02-24 14:28:26.847866	\N
3840	516	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.849814	2026-02-24 14:28:26.849814	\N
3841	516	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.851496	2026-02-24 14:28:26.851496	\N
3842	516	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.85325	2026-02-24 14:28:26.85325	\N
3843	517	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.855125	2026-02-24 14:28:26.855125	\N
3844	517	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.856875	2026-02-24 14:28:26.856875	\N
3845	517	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.859798	2026-02-24 14:28:26.859798	\N
3846	517	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.86182	2026-02-24 14:28:26.86182	\N
3847	517	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.864072	2026-02-24 14:28:26.864072	\N
3848	517	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.866509	2026-02-24 14:28:26.866509	\N
3849	517	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.868785	2026-02-24 14:28:26.868785	\N
3850	517	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.877047	2026-02-24 14:28:26.877047	\N
3851	517	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.87925	2026-02-24 14:28:26.87925	\N
3852	517	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.881351	2026-02-24 14:28:26.881351	\N
3853	517	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.883366	2026-02-24 14:28:26.883366	\N
3854	517	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.885517	2026-02-24 14:28:26.885517	\N
3855	518	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.887488	2026-02-24 14:28:26.887488	\N
3856	518	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.889403	2026-02-24 14:28:26.889403	\N
3857	518	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.892615	2026-02-24 14:28:26.892615	\N
3858	518	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.895211	2026-02-24 14:28:26.895211	\N
3859	518	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.897287	2026-02-24 14:28:26.897287	\N
3860	518	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.899114	2026-02-24 14:28:26.899114	\N
3861	518	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.900777	2026-02-24 14:28:26.900777	\N
3862	518	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.902629	2026-02-24 14:28:26.902629	\N
3863	518	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.904333	2026-02-24 14:28:26.904333	\N
3864	518	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.906081	2026-02-24 14:28:26.906081	\N
3865	518	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.908765	2026-02-24 14:28:26.908765	\N
3866	518	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.910923	2026-02-24 14:28:26.910923	\N
3867	519	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.912955	2026-02-24 14:28:26.912955	\N
3868	519	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.914725	2026-02-24 14:28:26.914725	\N
3869	519	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.916635	2026-02-24 14:28:26.916635	\N
3870	519	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.91844	2026-02-24 14:28:26.91844	\N
3871	519	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.920086	2026-02-24 14:28:26.920086	\N
3872	519	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.92191	2026-02-24 14:28:26.92191	\N
3873	519	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.923704	2026-02-24 14:28:26.923704	\N
3874	519	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.927433	2026-02-24 14:28:26.927433	\N
3875	519	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.930044	2026-02-24 14:28:26.930044	\N
3876	519	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.932162	2026-02-24 14:28:26.932162	\N
3877	519	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.93404	2026-02-24 14:28:26.93404	\N
3878	519	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.936007	2026-02-24 14:28:26.936007	\N
3879	520	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.937942	2026-02-24 14:28:26.937942	\N
3880	520	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.939645	2026-02-24 14:28:26.939645	\N
3881	520	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.94247	2026-02-24 14:28:26.94247	\N
3882	520	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.94465	2026-02-24 14:28:26.94465	\N
3883	520	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.946636	2026-02-24 14:28:26.946636	\N
3884	520	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.948375	2026-02-24 14:28:26.948375	\N
3885	520	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.950047	2026-02-24 14:28:26.950047	\N
3886	520	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.952047	2026-02-24 14:28:26.952047	\N
3887	520	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.953893	2026-02-24 14:28:26.953893	\N
3888	520	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.955674	2026-02-24 14:28:26.955674	\N
3889	520	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.958779	2026-02-24 14:28:26.958779	\N
3890	520	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.961037	2026-02-24 14:28:26.961037	\N
3891	521	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.963163	2026-02-24 14:28:26.963163	\N
3892	521	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.965012	2026-02-24 14:28:26.965012	\N
3893	521	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.966936	2026-02-24 14:28:26.966936	\N
3894	521	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.968719	2026-02-24 14:28:26.968719	\N
3895	521	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:26.970434	2026-02-24 14:28:26.970434	\N
3896	521	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:26.972488	2026-02-24 14:28:26.972488	\N
3897	521	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:26.975127	2026-02-24 14:28:26.975127	\N
3898	521	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:26.977661	2026-02-24 14:28:26.977661	\N
3899	521	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:26.979507	2026-02-24 14:28:26.979507	\N
3900	521	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:26.981157	2026-02-24 14:28:26.981157	\N
3901	521	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:26.983219	2026-02-24 14:28:26.983219	\N
3902	521	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:26.985937	2026-02-24 14:28:26.985937	\N
3903	522	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:26.988468	2026-02-24 14:28:26.988468	\N
3904	522	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:26.990515	2026-02-24 14:28:26.990515	\N
3905	522	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:26.995127	2026-02-24 14:28:26.995127	\N
3906	522	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:26.997983	2026-02-24 14:28:26.997983	\N
3907	522	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.000308	2026-02-24 14:28:27.000308	\N
3908	522	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.00215	2026-02-24 14:28:27.00215	\N
3909	522	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.004109	2026-02-24 14:28:27.004109	\N
3910	522	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.006051	2026-02-24 14:28:27.006051	\N
3911	522	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.010184	2026-02-24 14:28:27.010184	\N
3912	522	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.012842	2026-02-24 14:28:27.012842	\N
3913	522	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.015117	2026-02-24 14:28:27.015117	\N
3914	522	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.01705	2026-02-24 14:28:27.01705	\N
3915	523	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.019326	2026-02-24 14:28:27.019326	\N
3916	523	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.021208	2026-02-24 14:28:27.021208	\N
3917	523	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.023195	2026-02-24 14:28:27.023195	\N
3918	523	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.027346	2026-02-24 14:28:27.027346	\N
3919	523	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.02966	2026-02-24 14:28:27.02966	\N
3920	523	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.031769	2026-02-24 14:28:27.031769	\N
3921	523	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.034217	2026-02-24 14:28:27.034217	\N
3922	523	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.036506	2026-02-24 14:28:27.036506	\N
3923	523	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.038582	2026-02-24 14:28:27.038582	\N
3924	523	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.041595	2026-02-24 14:28:27.041595	\N
3925	523	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.044666	2026-02-24 14:28:27.044666	\N
3926	523	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.047033	2026-02-24 14:28:27.047033	\N
3927	524	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.049483	2026-02-24 14:28:27.049483	\N
3928	524	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.05174	2026-02-24 14:28:27.05174	\N
3929	524	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.054032	2026-02-24 14:28:27.054032	\N
3930	524	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.056242	2026-02-24 14:28:27.056242	\N
3931	524	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.060531	2026-02-24 14:28:27.060531	\N
3932	524	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.063452	2026-02-24 14:28:27.063452	\N
3933	524	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.066781	2026-02-24 14:28:27.066781	\N
3934	524	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.069469	2026-02-24 14:28:27.069469	\N
3935	524	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.071643	2026-02-24 14:28:27.071643	\N
3936	524	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.077847	2026-02-24 14:28:27.077847	\N
3937	524	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.080534	2026-02-24 14:28:27.080534	\N
3938	524	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.083016	2026-02-24 14:28:27.083016	\N
3939	525	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.085362	2026-02-24 14:28:27.085362	\N
3940	525	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.087616	2026-02-24 14:28:27.087616	\N
3941	525	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.090261	2026-02-24 14:28:27.090261	\N
3942	525	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.094187	2026-02-24 14:28:27.094187	\N
3943	525	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.096774	2026-02-24 14:28:27.096774	\N
3944	525	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.09896	2026-02-24 14:28:27.09896	\N
3945	525	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.10083	2026-02-24 14:28:27.10083	\N
3946	525	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.102583	2026-02-24 14:28:27.102583	\N
3947	525	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.105374	2026-02-24 14:28:27.105374	\N
3948	525	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.10787	2026-02-24 14:28:27.10787	\N
3949	525	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.110597	2026-02-24 14:28:27.110597	\N
3950	525	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.112422	2026-02-24 14:28:27.112422	\N
3951	526	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.114381	2026-02-24 14:28:27.114381	\N
3952	526	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.116246	2026-02-24 14:28:27.116246	\N
3953	526	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.118003	2026-02-24 14:28:27.118003	\N
3954	526	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.12014	2026-02-24 14:28:27.12014	\N
3955	526	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.12213	2026-02-24 14:28:27.12213	\N
3956	526	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.126024	2026-02-24 14:28:27.126024	\N
3957	526	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.129138	2026-02-24 14:28:27.129138	\N
3958	526	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.131443	2026-02-24 14:28:27.131443	\N
3959	526	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.133929	2026-02-24 14:28:27.133929	\N
3960	526	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.136454	2026-02-24 14:28:27.136454	\N
3961	526	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.138895	2026-02-24 14:28:27.138895	\N
3962	526	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.142086	2026-02-24 14:28:27.142086	\N
3963	527	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.146431	2026-02-24 14:28:27.146431	\N
3964	527	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.151127	2026-02-24 14:28:27.151127	\N
3965	527	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.155897	2026-02-24 14:28:27.155897	\N
3966	527	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.159063	2026-02-24 14:28:27.159063	\N
3967	527	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.161316	2026-02-24 14:28:27.161316	\N
3968	527	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.163228	2026-02-24 14:28:27.163228	\N
3969	527	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.165434	2026-02-24 14:28:27.165434	\N
3970	527	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.167375	2026-02-24 14:28:27.167375	\N
3971	527	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.169142	2026-02-24 14:28:27.169142	\N
3972	527	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.171234	2026-02-24 14:28:27.171234	\N
3973	527	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.175741	2026-02-24 14:28:27.175741	\N
3974	527	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.178716	2026-02-24 14:28:27.178716	\N
3975	528	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.180856	2026-02-24 14:28:27.180856	\N
3976	528	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.183344	2026-02-24 14:28:27.183344	\N
3977	528	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.1857	2026-02-24 14:28:27.1857	\N
3978	528	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.188171	2026-02-24 14:28:27.188171	\N
3979	528	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.190295	2026-02-24 14:28:27.190295	\N
3980	528	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.193842	2026-02-24 14:28:27.193842	\N
3981	528	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.196564	2026-02-24 14:28:27.196564	\N
3982	528	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.20127	2026-02-24 14:28:27.20127	\N
3983	528	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.204335	2026-02-24 14:28:27.204335	\N
3984	528	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.206912	2026-02-24 14:28:27.206912	\N
3985	528	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.210353	2026-02-24 14:28:27.210353	\N
3986	528	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.212299	2026-02-24 14:28:27.212299	\N
3987	529	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.214761	2026-02-24 14:28:27.214761	\N
3988	529	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.216651	2026-02-24 14:28:27.216651	\N
3989	529	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.218712	2026-02-24 14:28:27.218712	\N
3990	529	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.22068	2026-02-24 14:28:27.22068	\N
3991	529	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.222417	2026-02-24 14:28:27.222417	\N
3992	529	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.225715	2026-02-24 14:28:27.225715	\N
3993	529	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.228367	2026-02-24 14:28:27.228367	\N
3994	529	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.235772	2026-02-24 14:28:27.235772	\N
3995	529	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.239092	2026-02-24 14:28:27.239092	\N
3996	529	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.24346	2026-02-24 14:28:27.24346	\N
3997	529	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.247777	2026-02-24 14:28:27.247777	\N
3998	529	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.249884	2026-02-24 14:28:27.249884	\N
3999	530	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.251869	2026-02-24 14:28:27.251869	\N
4000	530	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.25382	2026-02-24 14:28:27.25382	\N
4001	530	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.25601	2026-02-24 14:28:27.25601	\N
4002	530	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.259108	2026-02-24 14:28:27.259108	\N
4003	530	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.263243	2026-02-24 14:28:27.263243	\N
4004	530	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.265813	2026-02-24 14:28:27.265813	\N
4005	530	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.270428	2026-02-24 14:28:27.270428	\N
4006	530	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.278138	2026-02-24 14:28:27.278138	\N
4007	530	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.281662	2026-02-24 14:28:27.281662	\N
4008	530	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.287084	2026-02-24 14:28:27.287084	\N
4009	530	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.294445	2026-02-24 14:28:27.294445	\N
4010	530	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.30032	2026-02-24 14:28:27.30032	\N
4011	531	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.302169	2026-02-24 14:28:27.302169	\N
4012	531	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.303895	2026-02-24 14:28:27.303895	\N
4013	531	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.306557	2026-02-24 14:28:27.306557	\N
4014	531	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.310529	2026-02-24 14:28:27.310529	\N
4015	531	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.312463	2026-02-24 14:28:27.312463	\N
4016	531	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.314546	2026-02-24 14:28:27.314546	\N
4017	531	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.31917	2026-02-24 14:28:27.31917	\N
4018	531	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.321319	2026-02-24 14:28:27.321319	\N
4019	531	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.323117	2026-02-24 14:28:27.323117	\N
4020	531	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.326455	2026-02-24 14:28:27.326455	\N
4021	531	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.328484	2026-02-24 14:28:27.328484	\N
4022	531	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.330456	2026-02-24 14:28:27.330456	\N
4023	532	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.337352	2026-02-24 14:28:27.337352	\N
4024	532	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.339261	2026-02-24 14:28:27.339261	\N
4025	532	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.341967	2026-02-24 14:28:27.341967	\N
4026	532	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.344319	2026-02-24 14:28:27.344319	\N
4027	532	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.34647	2026-02-24 14:28:27.34647	\N
4028	532	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.351235	2026-02-24 14:28:27.351235	\N
4029	532	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.353109	2026-02-24 14:28:27.353109	\N
4030	532	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.354889	2026-02-24 14:28:27.354889	\N
4031	532	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.357	2026-02-24 14:28:27.357	\N
4032	532	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.360119	2026-02-24 14:28:27.360119	\N
4033	532	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.365418	2026-02-24 14:28:27.365418	\N
4034	532	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.371668	2026-02-24 14:28:27.371668	\N
4035	533	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.373581	2026-02-24 14:28:27.373581	\N
4036	533	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.376827	2026-02-24 14:28:27.376827	\N
4037	533	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.378962	2026-02-24 14:28:27.378962	\N
4038	533	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.383303	2026-02-24 14:28:27.383303	\N
4039	533	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.385226	2026-02-24 14:28:27.385226	\N
4040	533	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.387303	2026-02-24 14:28:27.387303	\N
4041	533	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.389197	2026-02-24 14:28:27.389197	\N
4042	533	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.391717	2026-02-24 14:28:27.391717	\N
4043	533	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.394553	2026-02-24 14:28:27.394553	\N
4044	533	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.398752	2026-02-24 14:28:27.398752	\N
4045	533	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.400682	2026-02-24 14:28:27.400682	\N
4046	533	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.402438	2026-02-24 14:28:27.402438	\N
4047	534	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.404382	2026-02-24 14:28:27.404382	\N
4048	534	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.406235	2026-02-24 14:28:27.406235	\N
4049	534	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.409325	2026-02-24 14:28:27.409325	\N
4050	534	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.411406	2026-02-24 14:28:27.411406	\N
4051	534	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.413284	2026-02-24 14:28:27.413284	\N
4052	534	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.415417	2026-02-24 14:28:27.415417	\N
4053	534	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.417368	2026-02-24 14:28:27.417368	\N
4054	534	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.419279	2026-02-24 14:28:27.419279	\N
4055	534	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.421143	2026-02-24 14:28:27.421143	\N
4056	534	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.423074	2026-02-24 14:28:27.423074	\N
4057	534	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.426354	2026-02-24 14:28:27.426354	\N
4058	534	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.428503	2026-02-24 14:28:27.428503	\N
4059	535	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.430562	2026-02-24 14:28:27.430562	\N
4060	535	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.432418	2026-02-24 14:28:27.432418	\N
4061	535	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.435109	2026-02-24 14:28:27.435109	\N
4062	535	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.437448	2026-02-24 14:28:27.437448	\N
4063	535	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.439855	2026-02-24 14:28:27.439855	\N
4064	535	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.442928	2026-02-24 14:28:27.442928	\N
4065	535	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.445204	2026-02-24 14:28:27.445204	\N
4066	535	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.459043	2026-02-24 14:28:27.459043	\N
4067	535	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.463431	2026-02-24 14:28:27.463431	\N
4068	535	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.465803	2026-02-24 14:28:27.465803	\N
4069	535	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.470097	2026-02-24 14:28:27.470097	\N
4070	535	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.477923	2026-02-24 14:28:27.477923	\N
4071	536	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.480825	2026-02-24 14:28:27.480825	\N
4072	536	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.486845	2026-02-24 14:28:27.486845	\N
4073	536	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.489292	2026-02-24 14:28:27.489292	\N
4074	536	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.493591	2026-02-24 14:28:27.493591	\N
4075	536	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.49588	2026-02-24 14:28:27.49588	\N
4076	536	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.49805	2026-02-24 14:28:27.49805	\N
4077	536	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.499902	2026-02-24 14:28:27.499902	\N
4078	536	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.501931	2026-02-24 14:28:27.501931	\N
4079	536	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.503727	2026-02-24 14:28:27.503727	\N
4080	536	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.505527	2026-02-24 14:28:27.505527	\N
4081	536	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.508775	2026-02-24 14:28:27.508775	\N
4082	536	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.510892	2026-02-24 14:28:27.510892	\N
4083	537	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.512889	2026-02-24 14:28:27.512889	\N
4084	537	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.514651	2026-02-24 14:28:27.514651	\N
4085	537	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.51676	2026-02-24 14:28:27.51676	\N
4086	537	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.518579	2026-02-24 14:28:27.518579	\N
4087	537	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.52034	2026-02-24 14:28:27.52034	\N
4088	537	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.522392	2026-02-24 14:28:27.522392	\N
4089	537	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.524861	2026-02-24 14:28:27.524861	\N
4090	537	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.52743	2026-02-24 14:28:27.52743	\N
4091	537	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.529316	2026-02-24 14:28:27.529316	\N
4092	537	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.531184	2026-02-24 14:28:27.531184	\N
4093	537	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.533107	2026-02-24 14:28:27.533107	\N
4094	537	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.534931	2026-02-24 14:28:27.534931	\N
4095	538	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.537366	2026-02-24 14:28:27.537366	\N
4096	538	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.539236	2026-02-24 14:28:27.539236	\N
4097	538	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.541745	2026-02-24 14:28:27.541745	\N
4098	538	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.544224	2026-02-24 14:28:27.544224	\N
4099	538	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.546062	2026-02-24 14:28:27.546062	\N
4100	538	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.548155	2026-02-24 14:28:27.548155	\N
4101	538	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.550025	2026-02-24 14:28:27.550025	\N
4102	538	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.551755	2026-02-24 14:28:27.551755	\N
4103	538	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.553883	2026-02-24 14:28:27.553883	\N
4104	538	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.555794	2026-02-24 14:28:27.555794	\N
4105	538	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.560075	2026-02-24 14:28:27.560075	\N
4106	538	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.561967	2026-02-24 14:28:27.561967	\N
4107	539	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.567037	2026-02-24 14:28:27.567037	\N
4108	539	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.569474	2026-02-24 14:28:27.569474	\N
4109	539	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.571913	2026-02-24 14:28:27.571913	\N
4110	539	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.574565	2026-02-24 14:28:27.574565	\N
4111	539	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.578263	2026-02-24 14:28:27.578263	\N
4112	539	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.58216	2026-02-24 14:28:27.58216	\N
4113	539	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.588067	2026-02-24 14:28:27.588067	\N
4114	539	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.594371	2026-02-24 14:28:27.594371	\N
4115	539	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.59639	2026-02-24 14:28:27.59639	\N
4116	539	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.601021	2026-02-24 14:28:27.601021	\N
4117	539	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.602971	2026-02-24 14:28:27.602971	\N
4118	539	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.609486	2026-02-24 14:28:27.609486	\N
4119	540	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.615324	2026-02-24 14:28:27.615324	\N
4120	540	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.617367	2026-02-24 14:28:27.617367	\N
4121	540	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.619457	2026-02-24 14:28:27.619457	\N
4122	540	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.625767	2026-02-24 14:28:27.625767	\N
4123	540	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.62798	2026-02-24 14:28:27.62798	\N
4124	540	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.633797	2026-02-24 14:28:27.633797	\N
4125	540	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.636006	2026-02-24 14:28:27.636006	\N
4126	540	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.638202	2026-02-24 14:28:27.638202	\N
4127	540	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.640535	2026-02-24 14:28:27.640535	\N
4128	540	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.64387	2026-02-24 14:28:27.64387	\N
4129	540	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.645786	2026-02-24 14:28:27.645786	\N
4130	540	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.650466	2026-02-24 14:28:27.650466	\N
4131	541	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.652485	2026-02-24 14:28:27.652485	\N
4132	541	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.654519	2026-02-24 14:28:27.654519	\N
4133	541	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.656944	2026-02-24 14:28:27.656944	\N
4134	541	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.661106	2026-02-24 14:28:27.661106	\N
4135	541	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.662893	2026-02-24 14:28:27.662893	\N
4136	541	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.668563	2026-02-24 14:28:27.668563	\N
4137	541	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.675699	2026-02-24 14:28:27.675699	\N
4138	541	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.678707	2026-02-24 14:28:27.678707	\N
4139	541	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.683921	2026-02-24 14:28:27.683921	\N
4140	541	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.690682	2026-02-24 14:28:27.690682	\N
4141	541	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.69726	2026-02-24 14:28:27.69726	\N
4142	541	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.7024	2026-02-24 14:28:27.7024	\N
4143	542	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.704336	2026-02-24 14:28:27.704336	\N
4144	542	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.706286	2026-02-24 14:28:27.706286	\N
4145	542	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.709074	2026-02-24 14:28:27.709074	\N
4146	542	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.712877	2026-02-24 14:28:27.712877	\N
4147	542	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.714953	2026-02-24 14:28:27.714953	\N
4148	542	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.716793	2026-02-24 14:28:27.716793	\N
4149	542	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.718876	2026-02-24 14:28:27.718876	\N
4150	542	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.720784	2026-02-24 14:28:27.720784	\N
4151	542	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.723619	2026-02-24 14:28:27.723619	\N
4152	542	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.728103	2026-02-24 14:28:27.728103	\N
4153	542	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.744027	2026-02-24 14:28:27.744027	\N
4154	542	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.749531	2026-02-24 14:28:27.749531	\N
4155	543	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.751422	2026-02-24 14:28:27.751422	\N
4156	543	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.75781	2026-02-24 14:28:27.75781	\N
4157	543	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.762176	2026-02-24 14:28:27.762176	\N
4158	543	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.764181	2026-02-24 14:28:27.764181	\N
4159	543	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.766913	2026-02-24 14:28:27.766913	\N
4160	543	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.769251	2026-02-24 14:28:27.769251	\N
4161	543	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.77167	2026-02-24 14:28:27.77167	\N
4162	543	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.773656	2026-02-24 14:28:27.773656	\N
4163	543	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.776928	2026-02-24 14:28:27.776928	\N
4164	543	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.778791	2026-02-24 14:28:27.778791	\N
4165	543	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.780508	2026-02-24 14:28:27.780508	\N
4166	543	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.782398	2026-02-24 14:28:27.782398	\N
4167	544	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.78422	2026-02-24 14:28:27.78422	\N
4168	544	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.786042	2026-02-24 14:28:27.786042	\N
4169	544	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.78796	2026-02-24 14:28:27.78796	\N
4170	544	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.789719	2026-02-24 14:28:27.789719	\N
4171	544	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.792573	2026-02-24 14:28:27.792573	\N
4172	544	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.79467	2026-02-24 14:28:27.79467	\N
4173	544	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.796877	2026-02-24 14:28:27.796877	\N
4174	544	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.798953	2026-02-24 14:28:27.798953	\N
4175	544	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.800934	2026-02-24 14:28:27.800934	\N
4176	544	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.803055	2026-02-24 14:28:27.803055	\N
4177	544	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.804866	2026-02-24 14:28:27.804866	\N
4178	544	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.806787	2026-02-24 14:28:27.806787	\N
4179	545	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.809762	2026-02-24 14:28:27.809762	\N
4180	545	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.812138	2026-02-24 14:28:27.812138	\N
4181	545	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.814039	2026-02-24 14:28:27.814039	\N
4182	545	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.815968	2026-02-24 14:28:27.815968	\N
4183	545	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.81792	2026-02-24 14:28:27.81792	\N
4184	545	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.819675	2026-02-24 14:28:27.819675	\N
4185	545	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.821431	2026-02-24 14:28:27.821431	\N
4186	545	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.823211	2026-02-24 14:28:27.823211	\N
4187	545	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.825983	2026-02-24 14:28:27.825983	\N
4188	545	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.828526	2026-02-24 14:28:27.828526	\N
4189	545	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.830475	2026-02-24 14:28:27.830475	\N
4190	545	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.832387	2026-02-24 14:28:27.832387	\N
4191	546	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.834106	2026-02-24 14:28:27.834106	\N
4192	546	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.835831	2026-02-24 14:28:27.835831	\N
4193	546	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.837688	2026-02-24 14:28:27.837688	\N
4194	546	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.839483	2026-02-24 14:28:27.839483	\N
4195	546	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.84219	2026-02-24 14:28:27.84219	\N
4196	546	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.84446	2026-02-24 14:28:27.84446	\N
4197	546	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.846334	2026-02-24 14:28:27.846334	\N
4198	546	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.848126	2026-02-24 14:28:27.848126	\N
4199	546	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.849826	2026-02-24 14:28:27.849826	\N
4200	546	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.851656	2026-02-24 14:28:27.851656	\N
4201	546	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.853442	2026-02-24 14:28:27.853442	\N
4202	546	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.855229	2026-02-24 14:28:27.855229	\N
4203	547	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.857264	2026-02-24 14:28:27.857264	\N
4204	547	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.860157	2026-02-24 14:28:27.860157	\N
4205	547	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.862178	2026-02-24 14:28:27.862178	\N
4206	547	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.863902	2026-02-24 14:28:27.863902	\N
4207	547	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.865628	2026-02-24 14:28:27.865628	\N
4208	547	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.867961	2026-02-24 14:28:27.867961	\N
4209	547	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.870424	2026-02-24 14:28:27.870424	\N
4210	547	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.872808	2026-02-24 14:28:27.872808	\N
4211	547	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.875785	2026-02-24 14:28:27.875785	\N
4212	547	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.879674	2026-02-24 14:28:27.879674	\N
4213	547	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.881802	2026-02-24 14:28:27.881802	\N
4214	547	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.884119	2026-02-24 14:28:27.884119	\N
4215	548	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.88613	2026-02-24 14:28:27.88613	\N
4216	548	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.887993	2026-02-24 14:28:27.887993	\N
4217	548	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.890311	2026-02-24 14:28:27.890311	\N
4218	548	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.893806	2026-02-24 14:28:27.893806	\N
4219	548	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.896245	2026-02-24 14:28:27.896245	\N
4220	548	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.898357	2026-02-24 14:28:27.898357	\N
4221	548	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.900264	2026-02-24 14:28:27.900264	\N
4222	548	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.90197	2026-02-24 14:28:27.90197	\N
4223	548	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.90389	2026-02-24 14:28:27.90389	\N
4224	548	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.905767	2026-02-24 14:28:27.905767	\N
4225	548	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.908001	2026-02-24 14:28:27.908001	\N
4226	548	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.910713	2026-02-24 14:28:27.910713	\N
4227	549	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.912566	2026-02-24 14:28:27.912566	\N
4228	549	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.914466	2026-02-24 14:28:27.914466	\N
4229	549	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.91624	2026-02-24 14:28:27.91624	\N
4230	549	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.917965	2026-02-24 14:28:27.917965	\N
4231	549	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.919853	2026-02-24 14:28:27.919853	\N
4232	549	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.921952	2026-02-24 14:28:27.921952	\N
4233	549	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.923971	2026-02-24 14:28:27.923971	\N
4234	549	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.926704	2026-02-24 14:28:27.926704	\N
4235	549	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.928859	2026-02-24 14:28:27.928859	\N
4236	549	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.930719	2026-02-24 14:28:27.930719	\N
4237	549	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.932469	2026-02-24 14:28:27.932469	\N
4238	549	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.934329	2026-02-24 14:28:27.934329	\N
4239	550	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.936253	2026-02-24 14:28:27.936253	\N
4240	550	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.938034	2026-02-24 14:28:27.938034	\N
4241	550	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.93989	2026-02-24 14:28:27.93989	\N
4242	550	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.94266	2026-02-24 14:28:27.94266	\N
4243	550	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.945035	2026-02-24 14:28:27.945035	\N
4244	550	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.94696	2026-02-24 14:28:27.94696	\N
4245	550	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.948888	2026-02-24 14:28:27.948888	\N
4246	550	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.950727	2026-02-24 14:28:27.950727	\N
4247	550	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.952483	2026-02-24 14:28:27.952483	\N
4248	550	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.954368	2026-02-24 14:28:27.954368	\N
4249	550	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.956168	2026-02-24 14:28:27.956168	\N
4250	550	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.959021	2026-02-24 14:28:27.959021	\N
4251	551	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.961241	2026-02-24 14:28:27.961241	\N
4252	551	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.962983	2026-02-24 14:28:27.962983	\N
4253	551	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.964838	2026-02-24 14:28:27.964838	\N
4254	551	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.966807	2026-02-24 14:28:27.966807	\N
4255	551	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.96863	2026-02-24 14:28:27.96863	\N
4256	551	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.970511	2026-02-24 14:28:27.970511	\N
4257	551	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.972261	2026-02-24 14:28:27.972261	\N
4258	551	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.974275	2026-02-24 14:28:27.974275	\N
4259	551	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:27.977258	2026-02-24 14:28:27.977258	\N
4260	551	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:27.979141	2026-02-24 14:28:27.979141	\N
4261	551	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:27.981031	2026-02-24 14:28:27.981031	\N
4262	551	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:27.982856	2026-02-24 14:28:27.982856	\N
4263	552	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:27.984832	2026-02-24 14:28:27.984832	\N
4264	552	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:27.986641	2026-02-24 14:28:27.986641	\N
4265	552	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:27.98834	2026-02-24 14:28:27.98834	\N
4266	552	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:27.990241	2026-02-24 14:28:27.990241	\N
4267	552	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:27.993228	2026-02-24 14:28:27.993228	\N
4268	552	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:27.995304	2026-02-24 14:28:27.995304	\N
4269	552	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:27.997196	2026-02-24 14:28:27.997196	\N
4270	552	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:27.999021	2026-02-24 14:28:27.999021	\N
4271	552	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.000921	2026-02-24 14:28:28.000921	\N
4272	552	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.002728	2026-02-24 14:28:28.002728	\N
4273	552	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.004944	2026-02-24 14:28:28.004944	\N
4274	552	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.007002	2026-02-24 14:28:28.007002	\N
4275	553	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.010086	2026-02-24 14:28:28.010086	\N
4276	553	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.011907	2026-02-24 14:28:28.011907	\N
4277	553	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.013669	2026-02-24 14:28:28.013669	\N
4278	553	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.015565	2026-02-24 14:28:28.015565	\N
4279	553	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.017385	2026-02-24 14:28:28.017385	\N
4280	553	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.019114	2026-02-24 14:28:28.019114	\N
4281	553	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.020979	2026-02-24 14:28:28.020979	\N
4282	553	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.02268	2026-02-24 14:28:28.02268	\N
4283	553	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.025414	2026-02-24 14:28:28.025414	\N
4284	553	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.027698	2026-02-24 14:28:28.027698	\N
4285	553	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.029775	2026-02-24 14:28:28.029775	\N
4286	553	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.031623	2026-02-24 14:28:28.031623	\N
4287	554	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.033365	2026-02-24 14:28:28.033365	\N
4288	554	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.035344	2026-02-24 14:28:28.035344	\N
4289	554	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.037227	2026-02-24 14:28:28.037227	\N
4290	554	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.038928	2026-02-24 14:28:28.038928	\N
4291	554	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.041271	2026-02-24 14:28:28.041271	\N
4292	554	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.043906	2026-02-24 14:28:28.043906	\N
4293	554	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.046098	2026-02-24 14:28:28.046098	\N
4294	554	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.047931	2026-02-24 14:28:28.047931	\N
4295	554	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.049879	2026-02-24 14:28:28.049879	\N
4296	554	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.051637	2026-02-24 14:28:28.051637	\N
4297	554	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.053346	2026-02-24 14:28:28.053346	\N
4298	554	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.055293	2026-02-24 14:28:28.055293	\N
4299	555	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.057141	2026-02-24 14:28:28.057141	\N
4300	555	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.060133	2026-02-24 14:28:28.060133	\N
4301	555	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.062049	2026-02-24 14:28:28.062049	\N
4302	555	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.063789	2026-02-24 14:28:28.063789	\N
4303	555	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.065762	2026-02-24 14:28:28.065762	\N
4304	555	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.067611	2026-02-24 14:28:28.067611	\N
4305	555	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.069896	2026-02-24 14:28:28.069896	\N
4306	555	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.072167	2026-02-24 14:28:28.072167	\N
4307	555	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.075947	2026-02-24 14:28:28.075947	\N
4308	555	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.08078	2026-02-24 14:28:28.08078	\N
4309	555	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.082852	2026-02-24 14:28:28.082852	\N
4310	555	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.084997	2026-02-24 14:28:28.084997	\N
4311	556	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.087049	2026-02-24 14:28:28.087049	\N
4312	556	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.089029	2026-02-24 14:28:28.089029	\N
4313	556	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.092321	2026-02-24 14:28:28.092321	\N
4314	556	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.094848	2026-02-24 14:28:28.094848	\N
4315	556	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.096997	2026-02-24 14:28:28.096997	\N
4316	556	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.099046	2026-02-24 14:28:28.099046	\N
4317	556	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.101005	2026-02-24 14:28:28.101005	\N
4318	556	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.102779	2026-02-24 14:28:28.102779	\N
4319	556	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.104645	2026-02-24 14:28:28.104645	\N
4320	556	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.106544	2026-02-24 14:28:28.106544	\N
4321	556	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.109602	2026-02-24 14:28:28.109602	\N
4322	556	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.111743	2026-02-24 14:28:28.111743	\N
4323	557	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.113554	2026-02-24 14:28:28.113554	\N
4324	557	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.115445	2026-02-24 14:28:28.115445	\N
4325	557	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.117327	2026-02-24 14:28:28.117327	\N
4326	557	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.119136	2026-02-24 14:28:28.119136	\N
4327	557	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.121268	2026-02-24 14:28:28.121268	\N
4328	557	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.123267	2026-02-24 14:28:28.123267	\N
4329	557	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.128069	2026-02-24 14:28:28.128069	\N
4330	557	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.129919	2026-02-24 14:28:28.129919	\N
4331	557	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.13162	2026-02-24 14:28:28.13162	\N
4332	557	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.133648	2026-02-24 14:28:28.133648	\N
4333	557	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.135419	2026-02-24 14:28:28.135419	\N
4334	557	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.13777	2026-02-24 14:28:28.13777	\N
4335	558	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.139856	2026-02-24 14:28:28.139856	\N
4336	558	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.142833	2026-02-24 14:28:28.142833	\N
4337	558	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.144849	2026-02-24 14:28:28.144849	\N
4338	558	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.146632	2026-02-24 14:28:28.146632	\N
4339	558	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.148418	2026-02-24 14:28:28.148418	\N
4340	558	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.150166	2026-02-24 14:28:28.150166	\N
4341	558	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.152084	2026-02-24 14:28:28.152084	\N
4342	558	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.154569	2026-02-24 14:28:28.154569	\N
4343	558	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.158155	2026-02-24 14:28:28.158155	\N
4344	558	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.162066	2026-02-24 14:28:28.162066	\N
4345	558	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.164905	2026-02-24 14:28:28.164905	\N
4346	558	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.168306	2026-02-24 14:28:28.168306	\N
4347	559	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.171971	2026-02-24 14:28:28.171971	\N
4348	559	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.176204	2026-02-24 14:28:28.176204	\N
4349	559	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.178686	2026-02-24 14:28:28.178686	\N
4350	559	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.181315	2026-02-24 14:28:28.181315	\N
4351	559	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.185518	2026-02-24 14:28:28.185518	\N
4352	559	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.188045	2026-02-24 14:28:28.188045	\N
4353	559	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.190267	2026-02-24 14:28:28.190267	\N
4354	559	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.193435	2026-02-24 14:28:28.193435	\N
4355	559	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.195569	2026-02-24 14:28:28.195569	\N
4356	559	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.197727	2026-02-24 14:28:28.197727	\N
4357	559	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.200149	2026-02-24 14:28:28.200149	\N
4358	559	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.201938	2026-02-24 14:28:28.201938	\N
4359	560	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.203814	2026-02-24 14:28:28.203814	\N
4360	560	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.205578	2026-02-24 14:28:28.205578	\N
4361	560	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.20806	2026-02-24 14:28:28.20806	\N
4362	560	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.210634	2026-02-24 14:28:28.210634	\N
4363	560	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.212606	2026-02-24 14:28:28.212606	\N
4364	560	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.214475	2026-02-24 14:28:28.214475	\N
4365	560	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.21709	2026-02-24 14:28:28.21709	\N
4366	560	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.219004	2026-02-24 14:28:28.219004	\N
4367	560	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.220731	2026-02-24 14:28:28.220731	\N
4368	560	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.222469	2026-02-24 14:28:28.222469	\N
4369	560	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.224723	2026-02-24 14:28:28.224723	\N
4370	560	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.227174	2026-02-24 14:28:28.227174	\N
4371	561	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.229169	2026-02-24 14:28:28.229169	\N
4372	561	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.231393	2026-02-24 14:28:28.231393	\N
4373	561	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.233422	2026-02-24 14:28:28.233422	\N
4374	561	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.235259	2026-02-24 14:28:28.235259	\N
4375	561	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.237013	2026-02-24 14:28:28.237013	\N
4376	561	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.238859	2026-02-24 14:28:28.238859	\N
4377	561	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.240629	2026-02-24 14:28:28.240629	\N
4378	561	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.243525	2026-02-24 14:28:28.243525	\N
4379	561	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.24557	2026-02-24 14:28:28.24557	\N
4380	561	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.247526	2026-02-24 14:28:28.247526	\N
4381	561	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.249459	2026-02-24 14:28:28.249459	\N
4382	561	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.251198	2026-02-24 14:28:28.251198	\N
4383	562	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.25308	2026-02-24 14:28:28.25308	\N
4384	562	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.254905	2026-02-24 14:28:28.254905	\N
4385	562	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.256687	2026-02-24 14:28:28.256687	\N
4386	562	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.259744	2026-02-24 14:28:28.259744	\N
4387	562	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.261641	2026-02-24 14:28:28.261641	\N
4388	562	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.263508	2026-02-24 14:28:28.263508	\N
4389	562	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.265287	2026-02-24 14:28:28.265287	\N
4390	562	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.267017	2026-02-24 14:28:28.267017	\N
4391	562	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.268925	2026-02-24 14:28:28.268925	\N
4392	562	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.271202	2026-02-24 14:28:28.271202	\N
4393	562	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.273874	2026-02-24 14:28:28.273874	\N
4394	562	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.277238	2026-02-24 14:28:28.277238	\N
4395	563	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.284906	2026-02-24 14:28:28.284906	\N
4396	563	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.287044	2026-02-24 14:28:28.287044	\N
4397	563	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.288986	2026-02-24 14:28:28.288986	\N
4398	563	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.292206	2026-02-24 14:28:28.292206	\N
4399	563	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.294851	2026-02-24 14:28:28.294851	\N
4400	563	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.296969	2026-02-24 14:28:28.296969	\N
4401	563	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.298872	2026-02-24 14:28:28.298872	\N
4402	563	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.301149	2026-02-24 14:28:28.301149	\N
4403	563	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.303129	2026-02-24 14:28:28.303129	\N
4404	563	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.305034	2026-02-24 14:28:28.305034	\N
4405	563	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.306864	2026-02-24 14:28:28.306864	\N
4406	563	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.31051	2026-02-24 14:28:28.31051	\N
4407	564	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.312602	2026-02-24 14:28:28.312602	\N
4408	564	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.314766	2026-02-24 14:28:28.314766	\N
4409	564	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.316741	2026-02-24 14:28:28.316741	\N
4410	564	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.318522	2026-02-24 14:28:28.318522	\N
4411	564	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.320468	2026-02-24 14:28:28.320468	\N
4412	564	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.322207	2026-02-24 14:28:28.322207	\N
4413	564	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.324409	2026-02-24 14:28:28.324409	\N
4414	564	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.327294	2026-02-24 14:28:28.327294	\N
4415	564	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.329242	2026-02-24 14:28:28.329242	\N
4416	564	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.331077	2026-02-24 14:28:28.331077	\N
4417	564	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.333045	2026-02-24 14:28:28.333045	\N
4418	564	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.33498	2026-02-24 14:28:28.33498	\N
4419	565	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.336847	2026-02-24 14:28:28.336847	\N
4420	565	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.33858	2026-02-24 14:28:28.33858	\N
4421	565	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.340522	2026-02-24 14:28:28.340522	\N
4422	565	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.34325	2026-02-24 14:28:28.34325	\N
4423	565	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.345439	2026-02-24 14:28:28.345439	\N
4424	565	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.347235	2026-02-24 14:28:28.347235	\N
4425	565	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.348943	2026-02-24 14:28:28.348943	\N
4426	565	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.35078	2026-02-24 14:28:28.35078	\N
4427	565	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.352443	2026-02-24 14:28:28.352443	\N
4428	565	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.35426	2026-02-24 14:28:28.35426	\N
4429	565	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.356256	2026-02-24 14:28:28.356256	\N
4430	565	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.358979	2026-02-24 14:28:28.358979	\N
4431	566	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.361181	2026-02-24 14:28:28.361181	\N
4432	566	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.362979	2026-02-24 14:28:28.362979	\N
4433	566	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.364919	2026-02-24 14:28:28.364919	\N
4434	566	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.366724	2026-02-24 14:28:28.366724	\N
4435	566	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.368493	2026-02-24 14:28:28.368493	\N
4436	566	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.370592	2026-02-24 14:28:28.370592	\N
4437	566	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.372364	2026-02-24 14:28:28.372364	\N
4438	566	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.374626	2026-02-24 14:28:28.374626	\N
4439	566	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.37736	2026-02-24 14:28:28.37736	\N
4440	566	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.379267	2026-02-24 14:28:28.379267	\N
4441	566	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.381068	2026-02-24 14:28:28.381068	\N
4442	566	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.38276	2026-02-24 14:28:28.38276	\N
4443	567	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.384921	2026-02-24 14:28:28.384921	\N
4444	567	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.386831	2026-02-24 14:28:28.386831	\N
4445	567	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.388563	2026-02-24 14:28:28.388563	\N
4446	567	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.390426	2026-02-24 14:28:28.390426	\N
4447	567	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.39332	2026-02-24 14:28:28.39332	\N
4448	567	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.395438	2026-02-24 14:28:28.395438	\N
4449	567	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.397288	2026-02-24 14:28:28.397288	\N
4450	567	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.399009	2026-02-24 14:28:28.399009	\N
4451	567	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.400928	2026-02-24 14:28:28.400928	\N
4452	567	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.402651	2026-02-24 14:28:28.402651	\N
4453	567	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.404433	2026-02-24 14:28:28.404433	\N
4454	567	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.40622	2026-02-24 14:28:28.40622	\N
4455	568	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.408972	2026-02-24 14:28:28.408972	\N
4456	568	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.411151	2026-02-24 14:28:28.411151	\N
4457	568	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.412905	2026-02-24 14:28:28.412905	\N
4458	568	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.414832	2026-02-24 14:28:28.414832	\N
4459	568	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.41675	2026-02-24 14:28:28.41675	\N
4460	568	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.418458	2026-02-24 14:28:28.418458	\N
4461	568	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.420347	2026-02-24 14:28:28.420347	\N
4462	568	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.422125	2026-02-24 14:28:28.422125	\N
4463	568	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.423864	2026-02-24 14:28:28.423864	\N
4464	568	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.426866	2026-02-24 14:28:28.426866	\N
4465	568	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.428688	2026-02-24 14:28:28.428688	\N
4466	568	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.430578	2026-02-24 14:28:28.430578	\N
4467	569	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.432599	2026-02-24 14:28:28.432599	\N
4468	569	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.434491	2026-02-24 14:28:28.434491	\N
4469	569	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.436451	2026-02-24 14:28:28.436451	\N
4470	569	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.438206	2026-02-24 14:28:28.438206	\N
4471	569	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.440096	2026-02-24 14:28:28.440096	\N
4472	569	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.442871	2026-02-24 14:28:28.442871	\N
4473	569	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.445104	2026-02-24 14:28:28.445104	\N
4474	569	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.447027	2026-02-24 14:28:28.447027	\N
4475	569	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.448812	2026-02-24 14:28:28.448812	\N
4476	569	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.45082	2026-02-24 14:28:28.45082	\N
4477	569	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.452712	2026-02-24 14:28:28.452712	\N
4478	569	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.455016	2026-02-24 14:28:28.455016	\N
4479	570	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.45696	2026-02-24 14:28:28.45696	\N
4480	570	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.459893	2026-02-24 14:28:28.459893	\N
4481	570	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.461783	2026-02-24 14:28:28.461783	\N
4482	570	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.463462	2026-02-24 14:28:28.463462	\N
4483	570	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.465332	2026-02-24 14:28:28.465332	\N
4484	570	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.467054	2026-02-24 14:28:28.467054	\N
4485	570	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.468812	2026-02-24 14:28:28.468812	\N
4486	570	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.471279	2026-02-24 14:28:28.471279	\N
4487	570	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.475282	2026-02-24 14:28:28.475282	\N
4488	570	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.47833	2026-02-24 14:28:28.47833	\N
4489	570	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.480954	2026-02-24 14:28:28.480954	\N
4490	570	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.487318	2026-02-24 14:28:28.487318	\N
4491	571	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.489341	2026-02-24 14:28:28.489341	\N
4492	571	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.492442	2026-02-24 14:28:28.492442	\N
4493	571	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.494947	2026-02-24 14:28:28.494947	\N
4494	571	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.497274	2026-02-24 14:28:28.497274	\N
4495	571	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.499216	2026-02-24 14:28:28.499216	\N
4496	571	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.501126	2026-02-24 14:28:28.501126	\N
4497	571	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.503265	2026-02-24 14:28:28.503265	\N
4498	571	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.505426	2026-02-24 14:28:28.505426	\N
4499	571	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.507909	2026-02-24 14:28:28.507909	\N
4500	571	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.51033	2026-02-24 14:28:28.51033	\N
4501	571	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.51253	2026-02-24 14:28:28.51253	\N
4502	571	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.514348	2026-02-24 14:28:28.514348	\N
4503	576	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.516238	2026-02-24 14:28:28.516238	\N
4504	576	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.518059	2026-02-24 14:28:28.518059	\N
4505	576	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.519768	2026-02-24 14:28:28.519768	\N
4506	576	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.521644	2026-02-24 14:28:28.521644	\N
4507	576	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.52345	2026-02-24 14:28:28.52345	\N
4508	576	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.526309	2026-02-24 14:28:28.526309	\N
4509	576	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.528339	2026-02-24 14:28:28.528339	\N
4510	576	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.530083	2026-02-24 14:28:28.530083	\N
4511	576	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.531926	2026-02-24 14:28:28.531926	\N
4512	576	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.533726	2026-02-24 14:28:28.533726	\N
4513	576	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.535465	2026-02-24 14:28:28.535465	\N
4514	576	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.537335	2026-02-24 14:28:28.537335	\N
4515	577	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.539036	2026-02-24 14:28:28.539036	\N
4516	577	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.541132	2026-02-24 14:28:28.541132	\N
4517	577	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.543888	2026-02-24 14:28:28.543888	\N
4518	577	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.545765	2026-02-24 14:28:28.545765	\N
4519	577	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.547739	2026-02-24 14:28:28.547739	\N
4520	577	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.549457	2026-02-24 14:28:28.549457	\N
4521	577	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.55119	2026-02-24 14:28:28.55119	\N
4522	577	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.55299	2026-02-24 14:28:28.55299	\N
4523	577	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.554736	2026-02-24 14:28:28.554736	\N
4524	577	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.556738	2026-02-24 14:28:28.556738	\N
4525	577	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.559733	2026-02-24 14:28:28.559733	\N
4526	577	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.561781	2026-02-24 14:28:28.561781	\N
4527	578	31	1	2027	4000.00	4000.00	pending	0.00	2027-02-01	2026-02-24 14:28:28.563655	2026-02-24 14:28:28.563655	\N
4528	578	31	2	2027	4000.00	4000.00	pending	0.00	2027-03-01	2026-02-24 14:28:28.565369	2026-02-24 14:28:28.565369	\N
4529	578	31	3	2027	4000.00	4000.00	pending	0.00	2027-04-01	2026-02-24 14:28:28.567253	2026-02-24 14:28:28.567253	\N
4530	578	31	4	2027	4000.00	4000.00	pending	0.00	2027-05-01	2026-02-24 14:28:28.569043	2026-02-24 14:28:28.569043	\N
4531	578	31	5	2027	4000.00	4000.00	pending	0.00	2027-06-01	2026-02-24 14:28:28.570738	2026-02-24 14:28:28.570738	\N
4532	578	31	6	2027	4000.00	4000.00	pending	0.00	2027-07-01	2026-02-24 14:28:28.572583	2026-02-24 14:28:28.572583	\N
4533	578	31	7	2027	4000.00	4000.00	pending	0.00	2027-08-01	2026-02-24 14:28:28.574924	2026-02-24 14:28:28.574924	\N
4534	578	31	8	2027	4000.00	4000.00	pending	0.00	2027-09-01	2026-02-24 14:28:28.577411	2026-02-24 14:28:28.577411	\N
4535	578	31	9	2027	4000.00	4000.00	pending	0.00	2027-10-01	2026-02-24 14:28:28.57921	2026-02-24 14:28:28.57921	\N
4536	578	31	10	2027	4000.00	4000.00	pending	0.00	2027-11-01	2026-02-24 14:28:28.580995	2026-02-24 14:28:28.580995	\N
4537	578	31	11	2027	4000.00	4000.00	pending	0.00	2027-12-01	2026-02-24 14:28:28.582929	2026-02-24 14:28:28.582929	\N
4538	578	31	12	2027	4000.00	4000.00	pending	0.00	2028-01-01	2026-02-24 14:28:28.584697	2026-02-24 14:28:28.584697	\N
4539	579	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.559352	2026-02-24 14:50:10.559352	\N
4540	315	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.588849	2026-02-24 14:50:10.588849	\N
4541	316	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.591531	2026-02-24 14:50:10.591531	\N
4542	317	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.597473	2026-02-24 14:50:10.597473	\N
4543	318	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.601599	2026-02-24 14:50:10.601599	\N
4544	319	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.604115	2026-02-24 14:50:10.604115	\N
4545	320	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.606977	2026-02-24 14:50:10.606977	\N
4546	321	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.609573	2026-02-24 14:50:10.609573	\N
4547	322	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.614406	2026-02-24 14:50:10.614406	\N
4548	323	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.618527	2026-02-24 14:50:10.618527	\N
4549	311	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.62091	2026-02-24 14:50:10.62091	\N
4550	325	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.623331	2026-02-24 14:50:10.623331	\N
4551	326	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.625712	2026-02-24 14:50:10.625712	\N
4552	327	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.629629	2026-02-24 14:50:10.629629	\N
4553	328	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.636993	2026-02-24 14:50:10.636993	\N
4554	329	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.640714	2026-02-24 14:50:10.640714	\N
4555	330	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.643317	2026-02-24 14:50:10.643317	\N
4556	331	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.64831	2026-02-24 14:50:10.64831	\N
4557	332	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.651589	2026-02-24 14:50:10.651589	\N
4558	333	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.65375	2026-02-24 14:50:10.65375	\N
4559	334	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.656666	2026-02-24 14:50:10.656666	\N
4560	335	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.659157	2026-02-24 14:50:10.659157	\N
4561	310	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.663697	2026-02-24 14:50:10.663697	\N
4562	337	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.667783	2026-02-24 14:50:10.667783	\N
4563	338	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.670205	2026-02-24 14:50:10.670205	\N
4564	339	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.672309	2026-02-24 14:50:10.672309	\N
4565	340	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.674467	2026-02-24 14:50:10.674467	\N
4566	341	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.676673	2026-02-24 14:50:10.676673	\N
4567	342	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.681651	2026-02-24 14:50:10.681651	\N
4568	343	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.685232	2026-02-24 14:50:10.685232	\N
4569	344	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.687403	2026-02-24 14:50:10.687403	\N
4570	345	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.689604	2026-02-24 14:50:10.689604	\N
4571	346	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.691857	2026-02-24 14:50:10.691857	\N
4572	347	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.694194	2026-02-24 14:50:10.694194	\N
4573	309	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.700142	2026-02-24 14:50:10.700142	\N
4574	349	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.703056	2026-02-24 14:50:10.703056	\N
4575	350	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.705276	2026-02-24 14:50:10.705276	\N
4576	351	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.709155	2026-02-24 14:50:10.709155	\N
4577	352	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.716154	2026-02-24 14:50:10.716154	\N
4578	353	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.721152	2026-02-24 14:50:10.721152	\N
4579	354	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.723664	2026-02-24 14:50:10.723664	\N
4580	355	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.726023	2026-02-24 14:50:10.726023	\N
4581	356	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.729533	2026-02-24 14:50:10.729533	\N
4582	357	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.736885	2026-02-24 14:50:10.736885	\N
4583	358	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.73951	2026-02-24 14:50:10.73951	\N
4584	359	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.741727	2026-02-24 14:50:10.741727	\N
4585	308	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.743999	2026-02-24 14:50:10.743999	\N
4586	361	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.750058	2026-02-24 14:50:10.750058	\N
4587	362	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.752511	2026-02-24 14:50:10.752511	\N
4588	363	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.754972	2026-02-24 14:50:10.754972	\N
4589	364	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.757205	2026-02-24 14:50:10.757205	\N
4590	365	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.759563	2026-02-24 14:50:10.759563	\N
4591	366	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.765868	2026-02-24 14:50:10.765868	\N
4592	367	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.768716	2026-02-24 14:50:10.768716	\N
4593	368	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.771265	2026-02-24 14:50:10.771265	\N
4594	369	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.773432	2026-02-24 14:50:10.773432	\N
4595	370	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.775661	2026-02-24 14:50:10.775661	\N
4596	371	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.778663	2026-02-24 14:50:10.778663	\N
4597	307	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.782656	2026-02-24 14:50:10.782656	\N
4598	373	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.784789	2026-02-24 14:50:10.784789	\N
4599	374	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.787037	2026-02-24 14:50:10.787037	\N
4600	375	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.789171	2026-02-24 14:50:10.789171	\N
4601	376	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.793155	2026-02-24 14:50:10.793155	\N
4602	377	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.800115	2026-02-24 14:50:10.800115	\N
4603	378	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.803763	2026-02-24 14:50:10.803763	\N
4604	379	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.80602	2026-02-24 14:50:10.80602	\N
4605	380	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.808284	2026-02-24 14:50:10.808284	\N
4606	381	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.810786	2026-02-24 14:50:10.810786	\N
4607	382	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.81539	2026-02-24 14:50:10.81539	\N
4608	383	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.818008	2026-02-24 14:50:10.818008	\N
4609	313	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.820648	2026-02-24 14:50:10.820648	\N
4610	385	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.822718	2026-02-24 14:50:10.822718	\N
4611	386	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.824708	2026-02-24 14:50:10.824708	\N
4612	387	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.827134	2026-02-24 14:50:10.827134	\N
4613	314	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.830392	2026-02-24 14:50:10.830392	\N
4614	388	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.832617	2026-02-24 14:50:10.832617	\N
4615	389	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.834901	2026-02-24 14:50:10.834901	\N
4616	390	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.837501	2026-02-24 14:50:10.837501	\N
4617	391	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.839803	2026-02-24 14:50:10.839803	\N
4618	392	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.842144	2026-02-24 14:50:10.842144	\N
4619	393	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.845645	2026-02-24 14:50:10.845645	\N
4620	394	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.848448	2026-02-24 14:50:10.848448	\N
4621	395	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.850836	2026-02-24 14:50:10.850836	\N
4622	397	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.853449	2026-02-24 14:50:10.853449	\N
4623	398	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.856231	2026-02-24 14:50:10.856231	\N
4624	399	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.858502	2026-02-24 14:50:10.858502	\N
4625	400	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.862141	2026-02-24 14:50:10.862141	\N
4626	401	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.866485	2026-02-24 14:50:10.866485	\N
4627	402	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.87095	2026-02-24 14:50:10.87095	\N
4628	403	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.873265	2026-02-24 14:50:10.873265	\N
4629	404	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.876038	2026-02-24 14:50:10.876038	\N
4630	405	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.879623	2026-02-24 14:50:10.879623	\N
4631	406	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.888399	2026-02-24 14:50:10.888399	\N
4632	407	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.890771	2026-02-24 14:50:10.890771	\N
4633	491	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.892905	2026-02-24 14:50:10.892905	\N
4634	492	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.896218	2026-02-24 14:50:10.896218	\N
4635	493	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.898567	2026-02-24 14:50:10.898567	\N
4636	494	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.900635	2026-02-24 14:50:10.900635	\N
4637	495	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.903334	2026-02-24 14:50:10.903334	\N
4638	496	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.905709	2026-02-24 14:50:10.905709	\N
4639	497	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.908028	2026-02-24 14:50:10.908028	\N
4640	498	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.910244	2026-02-24 14:50:10.910244	\N
4641	499	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.913666	2026-02-24 14:50:10.913666	\N
4642	500	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.916047	2026-02-24 14:50:10.916047	\N
4643	501	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.918425	2026-02-24 14:50:10.918425	\N
4644	502	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.921017	2026-02-24 14:50:10.921017	\N
4645	503	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.923135	2026-02-24 14:50:10.923135	\N
4646	504	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.925225	2026-02-24 14:50:10.925225	\N
4647	505	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.927382	2026-02-24 14:50:10.927382	\N
4648	506	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.93033	2026-02-24 14:50:10.93033	\N
4649	507	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.932566	2026-02-24 14:50:10.932566	\N
4650	508	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.935792	2026-02-24 14:50:10.935792	\N
4651	509	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.939347	2026-02-24 14:50:10.939347	\N
4652	510	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.942462	2026-02-24 14:50:10.942462	\N
4653	511	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.948854	2026-02-24 14:50:10.948854	\N
4654	512	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.953403	2026-02-24 14:50:10.953403	\N
4655	513	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.957031	2026-02-24 14:50:10.957031	\N
4656	514	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.960473	2026-02-24 14:50:10.960473	\N
4657	515	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.964971	2026-02-24 14:50:10.964971	\N
4658	516	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.968591	2026-02-24 14:50:10.968591	\N
4659	517	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.972004	2026-02-24 14:50:10.972004	\N
4660	518	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.975301	2026-02-24 14:50:10.975301	\N
4661	519	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.977527	2026-02-24 14:50:10.977527	\N
4662	520	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.980574	2026-02-24 14:50:10.980574	\N
4663	521	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.983007	2026-02-24 14:50:10.983007	\N
4664	522	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.98561	2026-02-24 14:50:10.98561	\N
4665	523	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.988479	2026-02-24 14:50:10.988479	\N
4666	524	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.990829	2026-02-24 14:50:10.990829	\N
4667	525	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.993827	2026-02-24 14:50:10.993827	\N
4668	526	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.997375	2026-02-24 14:50:10.997375	\N
4669	527	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:10.999476	2026-02-24 14:50:10.999476	\N
4670	528	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.001989	2026-02-24 14:50:11.001989	\N
4671	529	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.004565	2026-02-24 14:50:11.004565	\N
4672	530	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.007856	2026-02-24 14:50:11.007856	\N
4673	531	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.011057	2026-02-24 14:50:11.011057	\N
4674	532	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.015347	2026-02-24 14:50:11.015347	\N
4675	533	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.017956	2026-02-24 14:50:11.017956	\N
4676	534	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.020241	2026-02-24 14:50:11.020241	\N
4677	535	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.022524	2026-02-24 14:50:11.022524	\N
4678	536	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.024834	2026-02-24 14:50:11.024834	\N
4679	537	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.027	2026-02-24 14:50:11.027	\N
4680	538	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.031081	2026-02-24 14:50:11.031081	\N
4681	539	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.033329	2026-02-24 14:50:11.033329	\N
4682	540	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.035466	2026-02-24 14:50:11.035466	\N
4683	541	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.037903	2026-02-24 14:50:11.037903	\N
4684	542	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.040372	2026-02-24 14:50:11.040372	\N
4685	543	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.042805	2026-02-24 14:50:11.042805	\N
4686	544	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.046109	2026-02-24 14:50:11.046109	\N
4687	545	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.048586	2026-02-24 14:50:11.048586	\N
4688	546	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.050864	2026-02-24 14:50:11.050864	\N
4689	547	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.053106	2026-02-24 14:50:11.053106	\N
4690	548	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.055402	2026-02-24 14:50:11.055402	\N
4691	549	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.057551	2026-02-24 14:50:11.057551	\N
4692	550	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.060005	2026-02-24 14:50:11.060005	\N
4693	551	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.063145	2026-02-24 14:50:11.063145	\N
4694	552	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.065444	2026-02-24 14:50:11.065444	\N
4695	553	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.068037	2026-02-24 14:50:11.068037	\N
4696	554	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.071018	2026-02-24 14:50:11.071018	\N
4697	555	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.073046	2026-02-24 14:50:11.073046	\N
4698	556	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.0761	2026-02-24 14:50:11.0761	\N
4699	557	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.079057	2026-02-24 14:50:11.079057	\N
4700	558	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.081527	2026-02-24 14:50:11.081527	\N
4701	559	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.084294	2026-02-24 14:50:11.084294	\N
4702	560	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.086664	2026-02-24 14:50:11.086664	\N
4703	561	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.088831	2026-02-24 14:50:11.088831	\N
4704	562	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.091114	2026-02-24 14:50:11.091114	\N
4705	563	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.093422	2026-02-24 14:50:11.093422	\N
4706	564	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.096907	2026-02-24 14:50:11.096907	\N
4707	565	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.099651	2026-02-24 14:50:11.099651	\N
4708	566	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.102336	2026-02-24 14:50:11.102336	\N
4709	567	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.104498	2026-02-24 14:50:11.104498	\N
4710	568	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.106978	2026-02-24 14:50:11.106978	\N
4711	569	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.109173	2026-02-24 14:50:11.109173	\N
4712	570	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.112728	2026-02-24 14:50:11.112728	\N
4713	571	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.116133	2026-02-24 14:50:11.116133	\N
4714	576	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.118849	2026-02-24 14:50:11.118849	\N
4715	577	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.121343	2026-02-24 14:50:11.121343	\N
4716	578	31	1	2025	4000.00	4000.00	pending	0.00	2025-02-01	2026-02-24 14:50:11.123758	2026-02-24 14:50:11.123758	\N
4717	579	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:00.850314	2026-02-24 14:54:00.850314	\N
4718	315	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.489344	2026-02-24 14:54:01.489344	\N
4719	316	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.502573	2026-02-24 14:54:01.502573	\N
4720	317	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.509477	2026-02-24 14:54:01.509477	\N
4721	318	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.51536	2026-02-24 14:54:01.51536	\N
4722	319	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.52172	2026-02-24 14:54:01.52172	\N
4723	320	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.524804	2026-02-24 14:54:01.524804	\N
4724	321	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.532753	2026-02-24 14:54:01.532753	\N
4725	322	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.536416	2026-02-24 14:54:01.536416	\N
4726	323	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.538699	2026-02-24 14:54:01.538699	\N
4727	311	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.540737	2026-02-24 14:54:01.540737	\N
4728	325	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.542896	2026-02-24 14:54:01.542896	\N
4729	326	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.544942	2026-02-24 14:54:01.544942	\N
4730	327	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.548647	2026-02-24 14:54:01.548647	\N
4731	328	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.551075	2026-02-24 14:54:01.551075	\N
4732	329	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.553236	2026-02-24 14:54:01.553236	\N
4733	330	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.558032	2026-02-24 14:54:01.558032	\N
4734	331	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.56023	2026-02-24 14:54:01.56023	\N
4735	332	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.563499	2026-02-24 14:54:01.563499	\N
4736	333	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.566219	2026-02-24 14:54:01.566219	\N
4737	334	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.568646	2026-02-24 14:54:01.568646	\N
4738	335	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.570707	2026-02-24 14:54:01.570707	\N
4739	310	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.572751	2026-02-24 14:54:01.572751	\N
4740	337	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.575164	2026-02-24 14:54:01.575164	\N
4741	338	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.577276	2026-02-24 14:54:01.577276	\N
4742	339	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.580444	2026-02-24 14:54:01.580444	\N
4743	340	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.582616	2026-02-24 14:54:01.582616	\N
4744	341	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.584858	2026-02-24 14:54:01.584858	\N
4745	342	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.586942	2026-02-24 14:54:01.586942	\N
4746	343	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.588938	2026-02-24 14:54:01.588938	\N
4747	344	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.590801	2026-02-24 14:54:01.590801	\N
4748	345	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.592537	2026-02-24 14:54:01.592537	\N
4749	346	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.59456	2026-02-24 14:54:01.59456	\N
4750	347	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.597867	2026-02-24 14:54:01.597867	\N
4751	309	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.599933	2026-02-24 14:54:01.599933	\N
4752	349	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.601664	2026-02-24 14:54:01.601664	\N
4753	350	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.603804	2026-02-24 14:54:01.603804	\N
4754	351	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.605862	2026-02-24 14:54:01.605862	\N
4755	352	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.607636	2026-02-24 14:54:01.607636	\N
4756	353	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.609688	2026-02-24 14:54:01.609688	\N
4757	354	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.612298	2026-02-24 14:54:01.612298	\N
4758	355	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.615167	2026-02-24 14:54:01.615167	\N
4759	356	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.617217	2026-02-24 14:54:01.617217	\N
4760	357	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.619076	2026-02-24 14:54:01.619076	\N
4761	358	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.621188	2026-02-24 14:54:01.621188	\N
4762	359	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.623008	2026-02-24 14:54:01.623008	\N
4763	308	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.624849	2026-02-24 14:54:01.624849	\N
4764	361	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.626761	2026-02-24 14:54:01.626761	\N
4765	362	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.629205	2026-02-24 14:54:01.629205	\N
4766	363	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.634887	2026-02-24 14:54:01.634887	\N
4767	364	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.638627	2026-02-24 14:54:01.638627	\N
4768	365	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.640913	2026-02-24 14:54:01.640913	\N
4769	366	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.642813	2026-02-24 14:54:01.642813	\N
4770	367	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.644943	2026-02-24 14:54:01.644943	\N
4771	368	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.648092	2026-02-24 14:54:01.648092	\N
4772	369	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.650042	2026-02-24 14:54:01.650042	\N
4773	370	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.651973	2026-02-24 14:54:01.651973	\N
4774	371	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.653773	2026-02-24 14:54:01.653773	\N
4776	373	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.657796	2026-02-24 14:54:01.657796	\N
4777	374	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.659581	2026-02-24 14:54:01.659581	\N
4778	375	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.661996	2026-02-24 14:54:01.661996	\N
4779	376	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.665047	2026-02-24 14:54:01.665047	\N
4780	377	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.667693	2026-02-24 14:54:01.667693	\N
4781	378	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.669664	2026-02-24 14:54:01.669664	\N
4782	379	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.67174	2026-02-24 14:54:01.67174	\N
4783	380	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.673558	2026-02-24 14:54:01.673558	\N
4784	381	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.675652	2026-02-24 14:54:01.675652	\N
4785	382	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.677684	2026-02-24 14:54:01.677684	\N
4786	383	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.680593	2026-02-24 14:54:01.680593	\N
4787	313	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.68284	2026-02-24 14:54:01.68284	\N
4788	385	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.684657	2026-02-24 14:54:01.684657	\N
4789	386	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.686564	2026-02-24 14:54:01.686564	\N
4790	387	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.688433	2026-02-24 14:54:01.688433	\N
4791	314	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.690321	2026-02-24 14:54:01.690321	\N
4792	388	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.692939	2026-02-24 14:54:01.692939	\N
4793	389	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.696793	2026-02-24 14:54:01.696793	\N
4794	390	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.699501	2026-02-24 14:54:01.699501	\N
4795	391	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.70566	2026-02-24 14:54:01.70566	\N
4796	392	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.708096	2026-02-24 14:54:01.708096	\N
4797	393	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.710425	2026-02-24 14:54:01.710425	\N
4798	394	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.713723	2026-02-24 14:54:01.713723	\N
4799	395	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.71616	2026-02-24 14:54:01.71616	\N
4800	397	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.718206	2026-02-24 14:54:01.718206	\N
4801	398	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.720554	2026-02-24 14:54:01.720554	\N
4802	399	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.722855	2026-02-24 14:54:01.722855	\N
4803	400	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.72485	2026-02-24 14:54:01.72485	\N
4804	401	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.726839	2026-02-24 14:54:01.726839	\N
4805	402	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.729367	2026-02-24 14:54:01.729367	\N
4806	403	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.73191	2026-02-24 14:54:01.73191	\N
4807	404	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.733906	2026-02-24 14:54:01.733906	\N
4808	405	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.736215	2026-02-24 14:54:01.736215	\N
4809	406	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.738161	2026-02-24 14:54:01.738161	\N
4810	407	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.740186	2026-02-24 14:54:01.740186	\N
4811	491	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.742021	2026-02-24 14:54:01.742021	\N
4812	492	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.744029	2026-02-24 14:54:01.744029	\N
4813	493	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.747199	2026-02-24 14:54:01.747199	\N
4814	494	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.749275	2026-02-24 14:54:01.749275	\N
4815	495	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.75119	2026-02-24 14:54:01.75119	\N
4816	496	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.753059	2026-02-24 14:54:01.753059	\N
4817	497	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.754949	2026-02-24 14:54:01.754949	\N
4818	498	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.756933	2026-02-24 14:54:01.756933	\N
4819	499	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.758809	2026-02-24 14:54:01.758809	\N
4820	500	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.761026	2026-02-24 14:54:01.761026	\N
4821	501	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.764682	2026-02-24 14:54:01.764682	\N
4822	502	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.766869	2026-02-24 14:54:01.766869	\N
4823	503	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.768822	2026-02-24 14:54:01.768822	\N
4824	504	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.770815	2026-02-24 14:54:01.770815	\N
4825	505	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.77266	2026-02-24 14:54:01.77266	\N
4826	506	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.774641	2026-02-24 14:54:01.774641	\N
4827	507	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.776682	2026-02-24 14:54:01.776682	\N
4828	508	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.779751	2026-02-24 14:54:01.779751	\N
4829	509	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.782338	2026-02-24 14:54:01.782338	\N
4830	510	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.78435	2026-02-24 14:54:01.78435	\N
4831	511	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.786472	2026-02-24 14:54:01.786472	\N
4832	512	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.788934	2026-02-24 14:54:01.788934	\N
4833	513	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.791237	2026-02-24 14:54:01.791237	\N
4834	514	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.793247	2026-02-24 14:54:01.793247	\N
4835	515	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.796199	2026-02-24 14:54:01.796199	\N
4836	516	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.79859	2026-02-24 14:54:01.79859	\N
4837	517	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.800678	2026-02-24 14:54:01.800678	\N
4838	518	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.802521	2026-02-24 14:54:01.802521	\N
4839	519	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.804353	2026-02-24 14:54:01.804353	\N
4840	520	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.806346	2026-02-24 14:54:01.806346	\N
4841	521	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.808166	2026-02-24 14:54:01.808166	\N
4842	522	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.810096	2026-02-24 14:54:01.810096	\N
4843	523	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.812597	2026-02-24 14:54:01.812597	\N
4844	524	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.815301	2026-02-24 14:54:01.815301	\N
4845	525	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.817314	2026-02-24 14:54:01.817314	\N
4846	526	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.819326	2026-02-24 14:54:01.819326	\N
4847	527	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.821246	2026-02-24 14:54:01.821246	\N
4848	528	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.823005	2026-02-24 14:54:01.823005	\N
4849	529	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.825095	2026-02-24 14:54:01.825095	\N
4850	530	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.827164	2026-02-24 14:54:01.827164	\N
4851	531	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.830885	2026-02-24 14:54:01.830885	\N
4852	532	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.833918	2026-02-24 14:54:01.833918	\N
4853	533	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.836436	2026-02-24 14:54:01.836436	\N
4854	534	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.838365	2026-02-24 14:54:01.838365	\N
4855	535	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.84041	2026-02-24 14:54:01.84041	\N
4856	536	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.842708	2026-02-24 14:54:01.842708	\N
4857	537	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.846844	2026-02-24 14:54:01.846844	\N
4858	538	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.849438	2026-02-24 14:54:01.849438	\N
4859	539	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.851771	2026-02-24 14:54:01.851771	\N
4860	540	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.853828	2026-02-24 14:54:01.853828	\N
4861	541	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.855953	2026-02-24 14:54:01.855953	\N
4862	542	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.858097	2026-02-24 14:54:01.858097	\N
4863	543	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.860819	2026-02-24 14:54:01.860819	\N
4864	544	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.864583	2026-02-24 14:54:01.864583	\N
4865	545	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.866835	2026-02-24 14:54:01.866835	\N
4866	546	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.86887	2026-02-24 14:54:01.86887	\N
4867	547	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.870919	2026-02-24 14:54:01.870919	\N
4868	548	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.872995	2026-02-24 14:54:01.872995	\N
4869	549	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.874806	2026-02-24 14:54:01.874806	\N
4870	550	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.876857	2026-02-24 14:54:01.876857	\N
4871	551	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.879664	2026-02-24 14:54:01.879664	\N
4872	552	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.886016	2026-02-24 14:54:01.886016	\N
4873	553	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.888453	2026-02-24 14:54:01.888453	\N
4874	554	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.890736	2026-02-24 14:54:01.890736	\N
4875	555	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.893907	2026-02-24 14:54:01.893907	\N
4876	556	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.898018	2026-02-24 14:54:01.898018	\N
4877	557	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.900488	2026-02-24 14:54:01.900488	\N
4878	558	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.905072	2026-02-24 14:54:01.905072	\N
4879	559	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.907572	2026-02-24 14:54:01.907572	\N
4880	560	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.909689	2026-02-24 14:54:01.909689	\N
4881	561	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.913028	2026-02-24 14:54:01.913028	\N
4882	562	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.91609	2026-02-24 14:54:01.91609	\N
4883	563	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.918434	2026-02-24 14:54:01.918434	\N
4884	564	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.921223	2026-02-24 14:54:01.921223	\N
4885	565	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.923322	2026-02-24 14:54:01.923322	\N
4886	566	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.925218	2026-02-24 14:54:01.925218	\N
4887	567	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.92726	2026-02-24 14:54:01.92726	\N
4888	568	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.930186	2026-02-24 14:54:01.930186	\N
4889	569	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.932626	2026-02-24 14:54:01.932626	\N
4890	570	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.934524	2026-02-24 14:54:01.934524	\N
4891	571	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.936802	2026-02-24 14:54:01.936802	\N
4892	576	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.938806	2026-02-24 14:54:01.938806	\N
4893	577	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.940758	2026-02-24 14:54:01.940758	\N
4894	578	31	2	2025	4000.00	4000.00	pending	0.00	2025-03-01	2026-02-24 14:54:01.942548	2026-02-24 14:54:01.942548	\N
4895	579	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:12.895233	2026-02-24 14:54:12.895233	\N
4896	579	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:13.628079	2026-02-24 14:54:13.628079	\N
4897	579	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:13.644339	2026-02-24 14:54:13.644339	\N
4898	579	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:13.658091	2026-02-24 14:54:13.658091	\N
4899	579	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:13.670625	2026-02-24 14:54:13.670625	\N
4900	579	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:13.677276	2026-02-24 14:54:13.677276	\N
4901	579	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:13.686988	2026-02-24 14:54:13.686988	\N
4902	579	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:13.691	2026-02-24 14:54:13.691	\N
4903	579	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:13.699204	2026-02-24 14:54:13.699204	\N
4904	579	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:13.702999	2026-02-24 14:54:13.702999	\N
4905	315	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:13.707854	2026-02-24 14:54:13.707854	\N
4906	315	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:13.711118	2026-02-24 14:54:13.711118	\N
4907	315	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:13.716193	2026-02-24 14:54:13.716193	\N
4908	315	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:13.72041	2026-02-24 14:54:13.72041	\N
4909	315	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:13.723733	2026-02-24 14:54:13.723733	\N
4910	315	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:13.726417	2026-02-24 14:54:13.726417	\N
4911	315	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:13.732945	2026-02-24 14:54:13.732945	\N
4912	315	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:13.73553	2026-02-24 14:54:13.73553	\N
4913	315	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:13.739779	2026-02-24 14:54:13.739779	\N
4914	315	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:13.742638	2026-02-24 14:54:13.742638	\N
4915	316	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:13.749411	2026-02-24 14:54:13.749411	\N
4916	316	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:13.753055	2026-02-24 14:54:13.753055	\N
4917	316	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:13.757885	2026-02-24 14:54:13.757885	\N
4918	316	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:13.760452	2026-02-24 14:54:13.760452	\N
4919	316	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:13.764136	2026-02-24 14:54:13.764136	\N
4920	316	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:13.767622	2026-02-24 14:54:13.767622	\N
4921	316	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:13.770458	2026-02-24 14:54:13.770458	\N
4922	316	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:13.772456	2026-02-24 14:54:13.772456	\N
4923	316	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:13.774513	2026-02-24 14:54:13.774513	\N
4924	316	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:13.776616	2026-02-24 14:54:13.776616	\N
4925	317	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:13.781827	2026-02-24 14:54:13.781827	\N
4926	317	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:13.784935	2026-02-24 14:54:13.784935	\N
4927	317	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:13.786974	2026-02-24 14:54:13.786974	\N
4928	317	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:13.789013	2026-02-24 14:54:13.789013	\N
4929	317	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:13.79114	2026-02-24 14:54:13.79114	\N
4930	317	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:13.793269	2026-02-24 14:54:13.793269	\N
4931	317	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:13.796513	2026-02-24 14:54:13.796513	\N
4932	317	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:13.798997	2026-02-24 14:54:13.798997	\N
4933	317	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:13.80112	2026-02-24 14:54:13.80112	\N
4934	317	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:13.803005	2026-02-24 14:54:13.803005	\N
4935	318	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:13.806593	2026-02-24 14:54:13.806593	\N
4936	318	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:13.808857	2026-02-24 14:54:13.808857	\N
4937	318	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:13.811153	2026-02-24 14:54:13.811153	\N
4938	318	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:13.81473	2026-02-24 14:54:13.81473	\N
4939	318	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:13.816993	2026-02-24 14:54:13.816993	\N
4940	318	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:13.820662	2026-02-24 14:54:13.820662	\N
4941	318	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:13.823375	2026-02-24 14:54:13.823375	\N
4942	318	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:13.825282	2026-02-24 14:54:13.825282	\N
4943	318	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:13.833841	2026-02-24 14:54:13.833841	\N
4944	318	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:13.839796	2026-02-24 14:54:13.839796	\N
4945	319	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:13.990467	2026-02-24 14:54:13.990467	\N
4946	319	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.066997	2026-02-24 14:54:14.066997	\N
4947	319	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.073411	2026-02-24 14:54:14.073411	\N
4948	319	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.07916	2026-02-24 14:54:14.07916	\N
4949	319	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.086775	2026-02-24 14:54:14.086775	\N
4950	319	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.089111	2026-02-24 14:54:14.089111	\N
4951	319	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.091793	2026-02-24 14:54:14.091793	\N
4952	319	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.098335	2026-02-24 14:54:14.098335	\N
4953	319	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.101793	2026-02-24 14:54:14.101793	\N
4954	319	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.104878	2026-02-24 14:54:14.104878	\N
4955	320	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.109782	2026-02-24 14:54:14.109782	\N
4956	320	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.11579	2026-02-24 14:54:14.11579	\N
4957	320	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.118235	2026-02-24 14:54:14.118235	\N
4958	320	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.120829	2026-02-24 14:54:14.120829	\N
4959	320	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.123315	2026-02-24 14:54:14.123315	\N
4960	320	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.126257	2026-02-24 14:54:14.126257	\N
4961	320	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.128343	2026-02-24 14:54:14.128343	\N
4962	320	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.13252	2026-02-24 14:54:14.13252	\N
4963	320	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.13531	2026-02-24 14:54:14.13531	\N
4964	320	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.137748	2026-02-24 14:54:14.137748	\N
4965	321	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.142639	2026-02-24 14:54:14.142639	\N
4966	321	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.149606	2026-02-24 14:54:14.149606	\N
4967	321	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.156717	2026-02-24 14:54:14.156717	\N
4968	321	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.159052	2026-02-24 14:54:14.159052	\N
4969	321	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.161395	2026-02-24 14:54:14.161395	\N
4970	321	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.166286	2026-02-24 14:54:14.166286	\N
4971	321	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.168421	2026-02-24 14:54:14.168421	\N
4972	321	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.170697	2026-02-24 14:54:14.170697	\N
4973	321	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.172797	2026-02-24 14:54:14.172797	\N
4974	321	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.175092	2026-02-24 14:54:14.175092	\N
4975	322	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.179472	2026-02-24 14:54:14.179472	\N
4976	322	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.191199	2026-02-24 14:54:14.191199	\N
4977	322	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.19393	2026-02-24 14:54:14.19393	\N
4978	322	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.199688	2026-02-24 14:54:14.199688	\N
4979	322	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.203081	2026-02-24 14:54:14.203081	\N
4980	322	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.205982	2026-02-24 14:54:14.205982	\N
4981	322	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.208591	2026-02-24 14:54:14.208591	\N
4982	322	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.210872	2026-02-24 14:54:14.210872	\N
4983	322	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.215759	2026-02-24 14:54:14.215759	\N
4984	322	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.219027	2026-02-24 14:54:14.219027	\N
4985	323	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.223089	2026-02-24 14:54:14.223089	\N
4986	323	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.225124	2026-02-24 14:54:14.225124	\N
4987	323	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.227324	2026-02-24 14:54:14.227324	\N
4988	323	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.232092	2026-02-24 14:54:14.232092	\N
4989	323	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.238117	2026-02-24 14:54:14.238117	\N
4990	323	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.240092	2026-02-24 14:54:14.240092	\N
4991	323	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.241957	2026-02-24 14:54:14.241957	\N
4992	323	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.244073	2026-02-24 14:54:14.244073	\N
4993	323	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.250044	2026-02-24 14:54:14.250044	\N
4994	323	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.253381	2026-02-24 14:54:14.253381	\N
4995	311	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.258514	2026-02-24 14:54:14.258514	\N
4996	311	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.267707	2026-02-24 14:54:14.267707	\N
4997	311	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.270485	2026-02-24 14:54:14.270485	\N
4998	311	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.272652	2026-02-24 14:54:14.272652	\N
4999	311	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.274813	2026-02-24 14:54:14.274813	\N
5000	311	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.277689	2026-02-24 14:54:14.277689	\N
5001	311	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.282856	2026-02-24 14:54:14.282856	\N
5002	311	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.286405	2026-02-24 14:54:14.286405	\N
5003	311	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.288967	2026-02-24 14:54:14.288967	\N
5004	311	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.29114	2026-02-24 14:54:14.29114	\N
5005	325	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.29476	2026-02-24 14:54:14.29476	\N
5006	325	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.299913	2026-02-24 14:54:14.299913	\N
5007	325	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.302192	2026-02-24 14:54:14.302192	\N
5008	325	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.304067	2026-02-24 14:54:14.304067	\N
5009	325	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.306385	2026-02-24 14:54:14.306385	\N
5010	325	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.308779	2026-02-24 14:54:14.308779	\N
5011	325	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.310992	2026-02-24 14:54:14.310992	\N
5012	325	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.316642	2026-02-24 14:54:14.316642	\N
5013	325	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.318835	2026-02-24 14:54:14.318835	\N
5014	325	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.320966	2026-02-24 14:54:14.320966	\N
5015	326	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.324228	2026-02-24 14:54:14.324228	\N
5016	326	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.326536	2026-02-24 14:54:14.326536	\N
5017	326	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.330335	2026-02-24 14:54:14.330335	\N
5018	326	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.333459	2026-02-24 14:54:14.333459	\N
5019	326	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.335686	2026-02-24 14:54:14.335686	\N
5020	326	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.337705	2026-02-24 14:54:14.337705	\N
5021	326	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.340542	2026-02-24 14:54:14.340542	\N
5022	326	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.342573	2026-02-24 14:54:14.342573	\N
5023	326	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.344423	2026-02-24 14:54:14.344423	\N
5024	326	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.349057	2026-02-24 14:54:14.349057	\N
5025	327	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.35279	2026-02-24 14:54:14.35279	\N
5026	327	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.354769	2026-02-24 14:54:14.354769	\N
5027	327	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.357556	2026-02-24 14:54:14.357556	\N
5028	327	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.360357	2026-02-24 14:54:14.360357	\N
5029	327	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.366056	2026-02-24 14:54:14.366056	\N
5030	327	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.368529	2026-02-24 14:54:14.368529	\N
5031	327	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.370606	2026-02-24 14:54:14.370606	\N
5032	327	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.372658	2026-02-24 14:54:14.372658	\N
5033	327	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.374527	2026-02-24 14:54:14.374527	\N
5034	327	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.376747	2026-02-24 14:54:14.376747	\N
5035	328	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.38316	2026-02-24 14:54:14.38316	\N
5036	328	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.387049	2026-02-24 14:54:14.387049	\N
5037	328	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.3894	2026-02-24 14:54:14.3894	\N
5038	328	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.392036	2026-02-24 14:54:14.392036	\N
5039	328	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.404647	2026-02-24 14:54:14.404647	\N
5040	328	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.409815	2026-02-24 14:54:14.409815	\N
5041	328	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.412917	2026-02-24 14:54:14.412917	\N
5042	328	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.417711	2026-02-24 14:54:14.417711	\N
5043	328	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.420731	2026-02-24 14:54:14.420731	\N
5044	328	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.424912	2026-02-24 14:54:14.424912	\N
5045	329	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.433724	2026-02-24 14:54:14.433724	\N
5046	329	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.439245	2026-02-24 14:54:14.439245	\N
5047	329	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.442018	2026-02-24 14:54:14.442018	\N
5048	329	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.447336	2026-02-24 14:54:14.447336	\N
5049	329	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.452159	2026-02-24 14:54:14.452159	\N
5050	329	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.455538	2026-02-24 14:54:14.455538	\N
5051	329	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.461097	2026-02-24 14:54:14.461097	\N
5052	329	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.468709	2026-02-24 14:54:14.468709	\N
5053	329	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.473015	2026-02-24 14:54:14.473015	\N
5054	329	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.47616	2026-02-24 14:54:14.47616	\N
5055	330	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.485348	2026-02-24 14:54:14.485348	\N
5056	330	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.489256	2026-02-24 14:54:14.489256	\N
5057	330	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.49214	2026-02-24 14:54:14.49214	\N
5058	330	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.494922	2026-02-24 14:54:14.494922	\N
5059	330	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.499495	2026-02-24 14:54:14.499495	\N
5060	330	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.502391	2026-02-24 14:54:14.502391	\N
5061	330	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.504528	2026-02-24 14:54:14.504528	\N
5062	330	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.507019	2026-02-24 14:54:14.507019	\N
5063	330	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.509353	2026-02-24 14:54:14.509353	\N
5064	330	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.51185	2026-02-24 14:54:14.51185	\N
5065	331	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.520516	2026-02-24 14:54:14.520516	\N
5066	331	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.522687	2026-02-24 14:54:14.522687	\N
5067	331	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.525331	2026-02-24 14:54:14.525331	\N
5068	331	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.527751	2026-02-24 14:54:14.527751	\N
5069	331	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.532911	2026-02-24 14:54:14.532911	\N
5070	331	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.536854	2026-02-24 14:54:14.536854	\N
5071	331	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.539029	2026-02-24 14:54:14.539029	\N
5072	331	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.541284	2026-02-24 14:54:14.541284	\N
5073	331	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.543725	2026-02-24 14:54:14.543725	\N
5074	331	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.547651	2026-02-24 14:54:14.547651	\N
5075	332	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.553179	2026-02-24 14:54:14.553179	\N
5076	332	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.556454	2026-02-24 14:54:14.556454	\N
5077	332	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.558866	2026-02-24 14:54:14.558866	\N
5078	332	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.560932	2026-02-24 14:54:14.560932	\N
5079	332	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.566063	2026-02-24 14:54:14.566063	\N
5080	332	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.56947	2026-02-24 14:54:14.56947	\N
5081	332	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.572066	2026-02-24 14:54:14.572066	\N
5082	332	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.574838	2026-02-24 14:54:14.574838	\N
5083	332	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.577191	2026-02-24 14:54:14.577191	\N
5084	332	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.581128	2026-02-24 14:54:14.581128	\N
5085	333	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.586431	2026-02-24 14:54:14.586431	\N
5086	333	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.58873	2026-02-24 14:54:14.58873	\N
5087	333	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.59105	2026-02-24 14:54:14.59105	\N
5088	333	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.593197	2026-02-24 14:54:14.593197	\N
5089	333	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.595116	2026-02-24 14:54:14.595116	\N
5090	333	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.600061	2026-02-24 14:54:14.600061	\N
5091	333	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.602353	2026-02-24 14:54:14.602353	\N
5092	333	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.604885	2026-02-24 14:54:14.604885	\N
5093	333	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.607521	2026-02-24 14:54:14.607521	\N
5094	333	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.609532	2026-02-24 14:54:14.609532	\N
5095	334	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.615709	2026-02-24 14:54:14.615709	\N
5096	334	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.618434	2026-02-24 14:54:14.618434	\N
5097	334	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.620478	2026-02-24 14:54:14.620478	\N
5098	334	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.623135	2026-02-24 14:54:14.623135	\N
5099	334	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.625068	2026-02-24 14:54:14.625068	\N
5100	334	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.627134	2026-02-24 14:54:14.627134	\N
5101	334	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.633105	2026-02-24 14:54:14.633105	\N
5102	334	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.636446	2026-02-24 14:54:14.636446	\N
5103	334	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.639213	2026-02-24 14:54:14.639213	\N
5104	334	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.641365	2026-02-24 14:54:14.641365	\N
5105	335	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.644788	2026-02-24 14:54:14.644788	\N
5106	335	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.650284	2026-02-24 14:54:14.650284	\N
5107	335	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.654431	2026-02-24 14:54:14.654431	\N
5108	335	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.657951	2026-02-24 14:54:14.657951	\N
5109	335	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.660479	2026-02-24 14:54:14.660479	\N
5110	335	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.667911	2026-02-24 14:54:14.667911	\N
5111	335	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.6707	2026-02-24 14:54:14.6707	\N
5112	335	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.673241	2026-02-24 14:54:14.673241	\N
5113	335	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.675806	2026-02-24 14:54:14.675806	\N
5114	335	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.678719	2026-02-24 14:54:14.678719	\N
5115	310	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.692368	2026-02-24 14:54:14.692368	\N
5116	310	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.697032	2026-02-24 14:54:14.697032	\N
5117	310	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.701459	2026-02-24 14:54:14.701459	\N
5118	310	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.703717	2026-02-24 14:54:14.703717	\N
5119	310	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.705892	2026-02-24 14:54:14.705892	\N
5120	310	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.707842	2026-02-24 14:54:14.707842	\N
5121	310	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.709843	2026-02-24 14:54:14.709843	\N
5122	310	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.711756	2026-02-24 14:54:14.711756	\N
5123	310	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.716373	2026-02-24 14:54:14.716373	\N
5124	310	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.718765	2026-02-24 14:54:14.718765	\N
5125	337	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.722544	2026-02-24 14:54:14.722544	\N
5126	337	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.72461	2026-02-24 14:54:14.72461	\N
5127	337	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.726574	2026-02-24 14:54:14.726574	\N
5128	337	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.729013	2026-02-24 14:54:14.729013	\N
5129	337	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.734369	2026-02-24 14:54:14.734369	\N
5130	337	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.737312	2026-02-24 14:54:14.737312	\N
5131	337	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.73989	2026-02-24 14:54:14.73989	\N
5132	337	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.742017	2026-02-24 14:54:14.742017	\N
5133	337	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.743837	2026-02-24 14:54:14.743837	\N
5134	337	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.748512	2026-02-24 14:54:14.748512	\N
5135	338	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.753153	2026-02-24 14:54:14.753153	\N
5136	338	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.755358	2026-02-24 14:54:14.755358	\N
5137	338	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.757519	2026-02-24 14:54:14.757519	\N
5138	338	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.759373	2026-02-24 14:54:14.759373	\N
5139	338	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.761331	2026-02-24 14:54:14.761331	\N
5140	338	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.767057	2026-02-24 14:54:14.767057	\N
5141	338	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.770365	2026-02-24 14:54:14.770365	\N
5142	338	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.773055	2026-02-24 14:54:14.773055	\N
5143	338	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.775504	2026-02-24 14:54:14.775504	\N
5144	338	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.778	2026-02-24 14:54:14.778	\N
5145	339	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.784628	2026-02-24 14:54:14.784628	\N
5146	339	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.786854	2026-02-24 14:54:14.786854	\N
5147	339	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.789163	2026-02-24 14:54:14.789163	\N
5148	339	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.791122	2026-02-24 14:54:14.791122	\N
5149	339	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.793022	2026-02-24 14:54:14.793022	\N
5150	339	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.795085	2026-02-24 14:54:14.795085	\N
5151	339	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.799368	2026-02-24 14:54:14.799368	\N
5152	339	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.801359	2026-02-24 14:54:14.801359	\N
5153	339	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.803405	2026-02-24 14:54:14.803405	\N
5154	339	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.805395	2026-02-24 14:54:14.805395	\N
5155	340	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.809243	2026-02-24 14:54:14.809243	\N
5156	340	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.811112	2026-02-24 14:54:14.811112	\N
5157	340	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.814824	2026-02-24 14:54:14.814824	\N
5158	340	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.816904	2026-02-24 14:54:14.816904	\N
5159	340	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.819008	2026-02-24 14:54:14.819008	\N
5160	340	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.820812	2026-02-24 14:54:14.820812	\N
5161	340	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.822793	2026-02-24 14:54:14.822793	\N
5162	340	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.824828	2026-02-24 14:54:14.824828	\N
5163	340	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.826724	2026-02-24 14:54:14.826724	\N
5164	340	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.829321	2026-02-24 14:54:14.829321	\N
5165	341	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.833803	2026-02-24 14:54:14.833803	\N
5166	341	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.835735	2026-02-24 14:54:14.835735	\N
5167	341	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.837619	2026-02-24 14:54:14.837619	\N
5168	341	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.839621	2026-02-24 14:54:14.839621	\N
5169	341	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.841393	2026-02-24 14:54:14.841393	\N
5170	341	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.843208	2026-02-24 14:54:14.843208	\N
5171	341	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.845673	2026-02-24 14:54:14.845673	\N
5172	341	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.84863	2026-02-24 14:54:14.84863	\N
5173	341	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.850784	2026-02-24 14:54:14.850784	\N
5174	341	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.853823	2026-02-24 14:54:14.853823	\N
5175	342	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.858549	2026-02-24 14:54:14.858549	\N
5176	342	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.861297	2026-02-24 14:54:14.861297	\N
5177	342	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.867525	2026-02-24 14:54:14.867525	\N
5178	342	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.869959	2026-02-24 14:54:14.869959	\N
5179	342	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.872257	2026-02-24 14:54:14.872257	\N
5180	342	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.874321	2026-02-24 14:54:14.874321	\N
5181	342	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.876597	2026-02-24 14:54:14.876597	\N
5182	342	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.879606	2026-02-24 14:54:14.879606	\N
5183	342	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.882465	2026-02-24 14:54:14.882465	\N
5184	342	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.884914	2026-02-24 14:54:14.884914	\N
5185	343	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.889623	2026-02-24 14:54:14.889623	\N
5186	343	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.892347	2026-02-24 14:54:14.892347	\N
5187	343	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.894496	2026-02-24 14:54:14.894496	\N
5188	343	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.897803	2026-02-24 14:54:14.897803	\N
5189	343	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.899893	2026-02-24 14:54:14.899893	\N
5190	343	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.902414	2026-02-24 14:54:14.902414	\N
5191	343	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.90434	2026-02-24 14:54:14.90434	\N
5192	343	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.9063	2026-02-24 14:54:14.9063	\N
5193	343	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.908186	2026-02-24 14:54:14.908186	\N
5194	343	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.909957	2026-02-24 14:54:14.909957	\N
5195	344	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.914498	2026-02-24 14:54:14.914498	\N
5196	344	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.916658	2026-02-24 14:54:14.916658	\N
5197	344	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.918617	2026-02-24 14:54:14.918617	\N
5198	344	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.920447	2026-02-24 14:54:14.920447	\N
5199	344	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.922527	2026-02-24 14:54:14.922527	\N
5200	344	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.924342	2026-02-24 14:54:14.924342	\N
5201	344	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.926214	2026-02-24 14:54:14.926214	\N
5202	344	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.928159	2026-02-24 14:54:14.928159	\N
5203	344	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.931081	2026-02-24 14:54:14.931081	\N
5204	344	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.936536	2026-02-24 14:54:14.936536	\N
5205	345	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.940456	2026-02-24 14:54:14.940456	\N
5206	345	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.94231	2026-02-24 14:54:14.94231	\N
5207	345	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.944303	2026-02-24 14:54:14.944303	\N
5208	345	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.947672	2026-02-24 14:54:14.947672	\N
5209	345	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.950256	2026-02-24 14:54:14.950256	\N
5210	345	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.952359	2026-02-24 14:54:14.952359	\N
5211	345	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.954691	2026-02-24 14:54:14.954691	\N
5212	345	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.956727	2026-02-24 14:54:14.956727	\N
5213	345	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.958543	2026-02-24 14:54:14.958543	\N
5214	345	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.960606	2026-02-24 14:54:14.960606	\N
5215	346	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.965698	2026-02-24 14:54:14.965698	\N
5216	346	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.968546	2026-02-24 14:54:14.968546	\N
5217	346	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.970637	2026-02-24 14:54:14.970637	\N
5218	346	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.972556	2026-02-24 14:54:14.972556	\N
5219	346	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.974406	2026-02-24 14:54:14.974406	\N
5220	346	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.976409	2026-02-24 14:54:14.976409	\N
5221	346	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:14.978266	2026-02-24 14:54:14.978266	\N
5222	346	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:14.981431	2026-02-24 14:54:14.981431	\N
5223	346	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:14.983339	2026-02-24 14:54:14.983339	\N
5224	346	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:14.985154	2026-02-24 14:54:14.985154	\N
5225	347	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:14.988611	2026-02-24 14:54:14.988611	\N
5226	347	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:14.99062	2026-02-24 14:54:14.99062	\N
5227	347	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:14.992522	2026-02-24 14:54:14.992522	\N
5228	347	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:14.994432	2026-02-24 14:54:14.994432	\N
5229	347	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:14.998019	2026-02-24 14:54:14.998019	\N
5230	347	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:14.999973	2026-02-24 14:54:14.999973	\N
5231	347	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.001981	2026-02-24 14:54:15.001981	\N
5232	347	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.003848	2026-02-24 14:54:15.003848	\N
5233	347	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.005615	2026-02-24 14:54:15.005615	\N
5234	347	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.007589	2026-02-24 14:54:15.007589	\N
5235	309	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.010803	2026-02-24 14:54:15.010803	\N
5236	309	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.013968	2026-02-24 14:54:15.013968	\N
5237	309	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.016012	2026-02-24 14:54:15.016012	\N
5238	309	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.01806	2026-02-24 14:54:15.01806	\N
5239	309	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.02019	2026-02-24 14:54:15.02019	\N
5240	309	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.02223	2026-02-24 14:54:15.02223	\N
5241	309	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.02407	2026-02-24 14:54:15.02407	\N
5242	309	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.025858	2026-02-24 14:54:15.025858	\N
5243	309	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.027954	2026-02-24 14:54:15.027954	\N
5244	309	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.03081	2026-02-24 14:54:15.03081	\N
5245	349	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.034397	2026-02-24 14:54:15.034397	\N
5246	349	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.03642	2026-02-24 14:54:15.03642	\N
5247	349	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.038302	2026-02-24 14:54:15.038302	\N
5248	349	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.040023	2026-02-24 14:54:15.040023	\N
5249	349	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.04192	2026-02-24 14:54:15.04192	\N
5250	349	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.043748	2026-02-24 14:54:15.043748	\N
5251	349	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.04733	2026-02-24 14:54:15.04733	\N
5252	349	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.04955	2026-02-24 14:54:15.04955	\N
5253	349	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.051376	2026-02-24 14:54:15.051376	\N
5254	349	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.053341	2026-02-24 14:54:15.053341	\N
5255	350	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.058305	2026-02-24 14:54:15.058305	\N
5256	350	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.062684	2026-02-24 14:54:15.062684	\N
5257	350	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.067587	2026-02-24 14:54:15.067587	\N
5258	350	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.069981	2026-02-24 14:54:15.069981	\N
5259	350	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.072055	2026-02-24 14:54:15.072055	\N
5260	350	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.074482	2026-02-24 14:54:15.074482	\N
5261	350	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.076757	2026-02-24 14:54:15.076757	\N
5262	350	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.080593	2026-02-24 14:54:15.080593	\N
5263	350	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.083293	2026-02-24 14:54:15.083293	\N
5264	350	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.086087	2026-02-24 14:54:15.086087	\N
5265	351	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.08966	2026-02-24 14:54:15.08966	\N
5266	351	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.091495	2026-02-24 14:54:15.091495	\N
5267	351	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.093373	2026-02-24 14:54:15.093373	\N
5268	351	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.096075	2026-02-24 14:54:15.096075	\N
5269	351	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.098578	2026-02-24 14:54:15.098578	\N
5270	351	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.10053	2026-02-24 14:54:15.10053	\N
5271	351	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.10228	2026-02-24 14:54:15.10228	\N
5272	351	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.104529	2026-02-24 14:54:15.104529	\N
5273	351	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.106499	2026-02-24 14:54:15.106499	\N
5274	351	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.108493	2026-02-24 14:54:15.108493	\N
5275	352	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.112048	2026-02-24 14:54:15.112048	\N
5276	352	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.114925	2026-02-24 14:54:15.114925	\N
5277	352	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.116906	2026-02-24 14:54:15.116906	\N
5278	352	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.118888	2026-02-24 14:54:15.118888	\N
5279	352	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.120959	2026-02-24 14:54:15.120959	\N
5280	352	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.122712	2026-02-24 14:54:15.122712	\N
5281	352	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.124673	2026-02-24 14:54:15.124673	\N
5282	352	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.126584	2026-02-24 14:54:15.126584	\N
5283	352	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.128483	2026-02-24 14:54:15.128483	\N
5284	352	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.13145	2026-02-24 14:54:15.13145	\N
5285	353	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.134822	2026-02-24 14:54:15.134822	\N
5286	353	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.136864	2026-02-24 14:54:15.136864	\N
5287	353	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.138672	2026-02-24 14:54:15.138672	\N
5288	353	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.14059	2026-02-24 14:54:15.14059	\N
5289	353	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.142427	2026-02-24 14:54:15.142427	\N
5290	353	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.144339	2026-02-24 14:54:15.144339	\N
5291	353	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.147775	2026-02-24 14:54:15.147775	\N
5292	353	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.149938	2026-02-24 14:54:15.149938	\N
5293	353	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.151872	2026-02-24 14:54:15.151872	\N
5294	353	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.153743	2026-02-24 14:54:15.153743	\N
5295	354	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.157165	2026-02-24 14:54:15.157165	\N
5296	354	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.159038	2026-02-24 14:54:15.159038	\N
5297	354	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.160768	2026-02-24 14:54:15.160768	\N
5298	354	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.163827	2026-02-24 14:54:15.163827	\N
5299	354	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.166105	2026-02-24 14:54:15.166105	\N
5300	354	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.168199	2026-02-24 14:54:15.168199	\N
5301	354	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.1701	2026-02-24 14:54:15.1701	\N
5302	354	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.172184	2026-02-24 14:54:15.172184	\N
5303	354	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.174162	2026-02-24 14:54:15.174162	\N
5304	354	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.176021	2026-02-24 14:54:15.176021	\N
5305	355	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.18045	2026-02-24 14:54:15.18045	\N
5306	355	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.182712	2026-02-24 14:54:15.182712	\N
5307	355	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.188326	2026-02-24 14:54:15.188326	\N
5308	355	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.190813	2026-02-24 14:54:15.190813	\N
5309	355	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.192581	2026-02-24 14:54:15.192581	\N
5310	355	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.194517	2026-02-24 14:54:15.194517	\N
5311	355	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.197877	2026-02-24 14:54:15.197877	\N
5312	355	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.20004	2026-02-24 14:54:15.20004	\N
5313	355	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.20184	2026-02-24 14:54:15.20184	\N
5314	355	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.203718	2026-02-24 14:54:15.203718	\N
5315	356	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.206969	2026-02-24 14:54:15.206969	\N
5316	356	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.208955	2026-02-24 14:54:15.208955	\N
5317	356	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.210817	2026-02-24 14:54:15.210817	\N
5318	356	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.214022	2026-02-24 14:54:15.214022	\N
5319	356	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.216262	2026-02-24 14:54:15.216262	\N
5320	356	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.218145	2026-02-24 14:54:15.218145	\N
5321	356	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.220102	2026-02-24 14:54:15.220102	\N
5322	356	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.221904	2026-02-24 14:54:15.221904	\N
5323	356	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.223616	2026-02-24 14:54:15.223616	\N
5324	356	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.225649	2026-02-24 14:54:15.225649	\N
5325	357	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.229899	2026-02-24 14:54:15.229899	\N
5326	357	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.23229	2026-02-24 14:54:15.23229	\N
5327	357	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.234144	2026-02-24 14:54:15.234144	\N
5328	357	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.236163	2026-02-24 14:54:15.236163	\N
5329	357	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.238096	2026-02-24 14:54:15.238096	\N
5330	357	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.239881	2026-02-24 14:54:15.239881	\N
5331	357	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.241761	2026-02-24 14:54:15.241761	\N
5332	357	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.2437	2026-02-24 14:54:15.2437	\N
5333	357	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.246638	2026-02-24 14:54:15.246638	\N
5334	357	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.24884	2026-02-24 14:54:15.24884	\N
5335	358	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.252095	2026-02-24 14:54:15.252095	\N
5336	358	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.253972	2026-02-24 14:54:15.253972	\N
5337	358	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.256827	2026-02-24 14:54:15.256827	\N
5338	358	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.259416	2026-02-24 14:54:15.259416	\N
5339	358	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.262619	2026-02-24 14:54:15.262619	\N
5340	358	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.268192	2026-02-24 14:54:15.268192	\N
5341	358	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.270416	2026-02-24 14:54:15.270416	\N
5342	358	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.272692	2026-02-24 14:54:15.272692	\N
5343	358	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.275027	2026-02-24 14:54:15.275027	\N
5344	358	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.277136	2026-02-24 14:54:15.277136	\N
5345	359	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.282424	2026-02-24 14:54:15.282424	\N
5346	359	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.285433	2026-02-24 14:54:15.285433	\N
5347	359	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.287469	2026-02-24 14:54:15.287469	\N
5348	359	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.289327	2026-02-24 14:54:15.289327	\N
5349	359	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.291036	2026-02-24 14:54:15.291036	\N
5350	359	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.292956	2026-02-24 14:54:15.292956	\N
5351	359	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.294756	2026-02-24 14:54:15.294756	\N
5352	359	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.298114	2026-02-24 14:54:15.298114	\N
5353	359	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.300113	2026-02-24 14:54:15.300113	\N
5354	359	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.301876	2026-02-24 14:54:15.301876	\N
5355	308	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.305277	2026-02-24 14:54:15.305277	\N
5356	308	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.30727	2026-02-24 14:54:15.30727	\N
5357	308	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.30925	2026-02-24 14:54:15.30925	\N
5358	308	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.310993	2026-02-24 14:54:15.310993	\N
5359	308	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.314162	2026-02-24 14:54:15.314162	\N
5360	308	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.31623	2026-02-24 14:54:15.31623	\N
5361	308	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.31834	2026-02-24 14:54:15.31834	\N
5362	308	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.320214	2026-02-24 14:54:15.320214	\N
5363	308	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.322035	2026-02-24 14:54:15.322035	\N
5364	308	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.324038	2026-02-24 14:54:15.324038	\N
5365	361	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.327317	2026-02-24 14:54:15.327317	\N
5366	361	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.330474	2026-02-24 14:54:15.330474	\N
5367	361	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.332715	2026-02-24 14:54:15.332715	\N
5368	361	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.334846	2026-02-24 14:54:15.334846	\N
5369	361	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.33702	2026-02-24 14:54:15.33702	\N
5370	361	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.339073	2026-02-24 14:54:15.339073	\N
5371	361	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.341021	2026-02-24 14:54:15.341021	\N
5372	361	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.342994	2026-02-24 14:54:15.342994	\N
5373	361	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.345045	2026-02-24 14:54:15.345045	\N
5374	361	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.348148	2026-02-24 14:54:15.348148	\N
5375	362	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.351473	2026-02-24 14:54:15.351473	\N
5376	362	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.353378	2026-02-24 14:54:15.353378	\N
5377	362	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.35516	2026-02-24 14:54:15.35516	\N
5378	362	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.357013	2026-02-24 14:54:15.357013	\N
5379	362	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.359047	2026-02-24 14:54:15.359047	\N
5380	362	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.360881	2026-02-24 14:54:15.360881	\N
5381	362	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.363993	2026-02-24 14:54:15.363993	\N
5382	362	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.366437	2026-02-24 14:54:15.366437	\N
5383	362	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.368726	2026-02-24 14:54:15.368726	\N
5384	362	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.370765	2026-02-24 14:54:15.370765	\N
5385	363	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.374195	2026-02-24 14:54:15.374195	\N
5386	363	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.37611	2026-02-24 14:54:15.37611	\N
5387	363	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.377953	2026-02-24 14:54:15.377953	\N
5388	363	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.380847	2026-02-24 14:54:15.380847	\N
5389	363	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.382917	2026-02-24 14:54:15.382917	\N
5390	363	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.384933	2026-02-24 14:54:15.384933	\N
5391	363	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.386822	2026-02-24 14:54:15.386822	\N
5392	363	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.388919	2026-02-24 14:54:15.388919	\N
5393	363	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.390905	2026-02-24 14:54:15.390905	\N
5394	363	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.39266	2026-02-24 14:54:15.39266	\N
5395	364	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.397474	2026-02-24 14:54:15.397474	\N
5396	364	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.400592	2026-02-24 14:54:15.400592	\N
5397	364	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.402788	2026-02-24 14:54:15.402788	\N
5398	364	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.404814	2026-02-24 14:54:15.404814	\N
5399	364	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.406738	2026-02-24 14:54:15.406738	\N
5400	364	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.408501	2026-02-24 14:54:15.408501	\N
5401	364	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.410634	2026-02-24 14:54:15.410634	\N
5402	364	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.413608	2026-02-24 14:54:15.413608	\N
5403	364	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.415857	2026-02-24 14:54:15.415857	\N
5404	364	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.417803	2026-02-24 14:54:15.417803	\N
5405	365	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.42115	2026-02-24 14:54:15.42115	\N
5406	365	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.422946	2026-02-24 14:54:15.422946	\N
5407	365	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.424722	2026-02-24 14:54:15.424722	\N
5408	365	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.426795	2026-02-24 14:54:15.426795	\N
5409	365	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.429142	2026-02-24 14:54:15.429142	\N
5410	365	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.431945	2026-02-24 14:54:15.431945	\N
5411	365	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.433854	2026-02-24 14:54:15.433854	\N
5412	365	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.440936	2026-02-24 14:54:15.440936	\N
5413	365	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.443017	2026-02-24 14:54:15.443017	\N
5414	365	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.444889	2026-02-24 14:54:15.444889	\N
5415	366	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.449425	2026-02-24 14:54:15.449425	\N
5416	366	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.451229	2026-02-24 14:54:15.451229	\N
5417	366	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.453262	2026-02-24 14:54:15.453262	\N
5418	366	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.455755	2026-02-24 14:54:15.455755	\N
5419	366	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.458512	2026-02-24 14:54:15.458512	\N
5420	366	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.461657	2026-02-24 14:54:15.461657	\N
5421	366	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.466461	2026-02-24 14:54:15.466461	\N
5422	366	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.471145	2026-02-24 14:54:15.471145	\N
5423	366	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.473344	2026-02-24 14:54:15.473344	\N
5424	366	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.475742	2026-02-24 14:54:15.475742	\N
5425	367	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.482232	2026-02-24 14:54:15.482232	\N
5426	367	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.484844	2026-02-24 14:54:15.484844	\N
5427	367	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.487314	2026-02-24 14:54:15.487314	\N
5428	367	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.489487	2026-02-24 14:54:15.489487	\N
5429	367	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.491639	2026-02-24 14:54:15.491639	\N
5430	367	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.494007	2026-02-24 14:54:15.494007	\N
5431	367	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.497239	2026-02-24 14:54:15.497239	\N
5432	367	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.499432	2026-02-24 14:54:15.499432	\N
5433	367	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.501693	2026-02-24 14:54:15.501693	\N
5434	367	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.503653	2026-02-24 14:54:15.503653	\N
5435	368	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.507193	2026-02-24 14:54:15.507193	\N
5436	368	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.50985	2026-02-24 14:54:15.50985	\N
5437	368	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.512522	2026-02-24 14:54:15.512522	\N
5438	368	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.514992	2026-02-24 14:54:15.514992	\N
5439	368	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.517107	2026-02-24 14:54:15.517107	\N
5440	368	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.519034	2026-02-24 14:54:15.519034	\N
5441	368	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.52081	2026-02-24 14:54:15.52081	\N
5442	368	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.522978	2026-02-24 14:54:15.522978	\N
5443	368	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.525385	2026-02-24 14:54:15.525385	\N
5444	368	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.527452	2026-02-24 14:54:15.527452	\N
5445	369	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.532226	2026-02-24 14:54:15.532226	\N
5446	369	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.537781	2026-02-24 14:54:15.537781	\N
5447	369	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.540082	2026-02-24 14:54:15.540082	\N
5448	369	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.542402	2026-02-24 14:54:15.542402	\N
5449	369	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.544364	2026-02-24 14:54:15.544364	\N
5450	369	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.54741	2026-02-24 14:54:15.54741	\N
5451	369	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.549579	2026-02-24 14:54:15.549579	\N
5452	369	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.551422	2026-02-24 14:54:15.551422	\N
5453	369	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.553241	2026-02-24 14:54:15.553241	\N
5454	369	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.5554	2026-02-24 14:54:15.5554	\N
5455	370	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.559567	2026-02-24 14:54:15.559567	\N
5456	370	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.561457	2026-02-24 14:54:15.561457	\N
5457	370	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.564522	2026-02-24 14:54:15.564522	\N
5458	370	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.566522	2026-02-24 14:54:15.566522	\N
5459	370	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.568297	2026-02-24 14:54:15.568297	\N
5460	370	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.570378	2026-02-24 14:54:15.570378	\N
5461	370	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.572209	2026-02-24 14:54:15.572209	\N
5462	370	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.573922	2026-02-24 14:54:15.573922	\N
5463	370	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.575904	2026-02-24 14:54:15.575904	\N
5464	370	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.577745	2026-02-24 14:54:15.577745	\N
5465	371	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.582609	2026-02-24 14:54:15.582609	\N
5466	371	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.585126	2026-02-24 14:54:15.585126	\N
5467	371	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.58713	2026-02-24 14:54:15.58713	\N
5468	371	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.588882	2026-02-24 14:54:15.588882	\N
5469	371	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.590784	2026-02-24 14:54:15.590784	\N
5470	371	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.592561	2026-02-24 14:54:15.592561	\N
5471	371	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.594405	2026-02-24 14:54:15.594405	\N
5472	371	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.597562	2026-02-24 14:54:15.597562	\N
5473	371	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.599705	2026-02-24 14:54:15.599705	\N
5474	371	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.601674	2026-02-24 14:54:15.601674	\N
5476	307	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.606898	2026-02-24 14:54:15.606898	\N
5477	307	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.6087	2026-02-24 14:54:15.6087	\N
5478	307	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.610713	2026-02-24 14:54:15.610713	\N
5479	307	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.614022	2026-02-24 14:54:15.614022	\N
5480	307	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.617201	2026-02-24 14:54:15.617201	\N
5481	307	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.619541	2026-02-24 14:54:15.619541	\N
5482	307	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.621539	2026-02-24 14:54:15.621539	\N
5483	307	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.623419	2026-02-24 14:54:15.623419	\N
5484	307	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.625454	2026-02-24 14:54:15.625454	\N
5485	373	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.629137	2026-02-24 14:54:15.629137	\N
5486	373	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.631877	2026-02-24 14:54:15.631877	\N
5487	373	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.633871	2026-02-24 14:54:15.633871	\N
5488	373	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.635709	2026-02-24 14:54:15.635709	\N
5489	373	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.637686	2026-02-24 14:54:15.637686	\N
5490	373	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.639434	2026-02-24 14:54:15.639434	\N
5491	373	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.641338	2026-02-24 14:54:15.641338	\N
5492	373	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.643251	2026-02-24 14:54:15.643251	\N
5493	373	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.645232	2026-02-24 14:54:15.645232	\N
5494	373	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.648684	2026-02-24 14:54:15.648684	\N
5495	374	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.65193	2026-02-24 14:54:15.65193	\N
5496	374	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.653967	2026-02-24 14:54:15.653967	\N
5497	374	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.656584	2026-02-24 14:54:15.656584	\N
5498	374	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.659186	2026-02-24 14:54:15.659186	\N
5499	374	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.661454	2026-02-24 14:54:15.661454	\N
5500	374	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.667396	2026-02-24 14:54:15.667396	\N
5501	374	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.669952	2026-02-24 14:54:15.669952	\N
5502	374	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.672065	2026-02-24 14:54:15.672065	\N
5503	374	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.674042	2026-02-24 14:54:15.674042	\N
5504	374	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.676287	2026-02-24 14:54:15.676287	\N
5505	375	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.681481	2026-02-24 14:54:15.681481	\N
5506	375	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.684843	2026-02-24 14:54:15.684843	\N
5507	375	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.690322	2026-02-24 14:54:15.690322	\N
5508	375	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.692226	2026-02-24 14:54:15.692226	\N
5509	375	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.694212	2026-02-24 14:54:15.694212	\N
5510	375	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.697479	2026-02-24 14:54:15.697479	\N
5511	375	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.6996	2026-02-24 14:54:15.6996	\N
5512	375	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.701466	2026-02-24 14:54:15.701466	\N
5513	375	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.70332	2026-02-24 14:54:15.70332	\N
5514	375	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.705394	2026-02-24 14:54:15.705394	\N
5515	376	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.708779	2026-02-24 14:54:15.708779	\N
5516	376	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.710967	2026-02-24 14:54:15.710967	\N
5517	376	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.713881	2026-02-24 14:54:15.713881	\N
5518	376	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.716216	2026-02-24 14:54:15.716216	\N
5519	376	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.71816	2026-02-24 14:54:15.71816	\N
5520	376	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.720195	2026-02-24 14:54:15.720195	\N
5521	376	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.722069	2026-02-24 14:54:15.722069	\N
5522	376	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.723857	2026-02-24 14:54:15.723857	\N
5523	376	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.726324	2026-02-24 14:54:15.726324	\N
5524	376	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.728256	2026-02-24 14:54:15.728256	\N
5525	377	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.733283	2026-02-24 14:54:15.733283	\N
5526	377	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.735574	2026-02-24 14:54:15.735574	\N
5527	377	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.73784	2026-02-24 14:54:15.73784	\N
5528	377	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.739871	2026-02-24 14:54:15.739871	\N
5529	377	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.741901	2026-02-24 14:54:15.741901	\N
5530	377	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.743657	2026-02-24 14:54:15.743657	\N
5531	377	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.746544	2026-02-24 14:54:15.746544	\N
5532	377	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.748801	2026-02-24 14:54:15.748801	\N
5533	377	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.751058	2026-02-24 14:54:15.751058	\N
5534	377	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.752956	2026-02-24 14:54:15.752956	\N
5535	378	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.756462	2026-02-24 14:54:15.756462	\N
5536	378	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.758525	2026-02-24 14:54:15.758525	\N
5537	378	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.760584	2026-02-24 14:54:15.760584	\N
5538	378	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.763837	2026-02-24 14:54:15.763837	\N
5539	378	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.7665	2026-02-24 14:54:15.7665	\N
5540	378	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.768812	2026-02-24 14:54:15.768812	\N
5541	378	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.771032	2026-02-24 14:54:15.771032	\N
5542	378	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.772894	2026-02-24 14:54:15.772894	\N
5543	378	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.774626	2026-02-24 14:54:15.774626	\N
5544	378	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.776578	2026-02-24 14:54:15.776578	\N
5545	379	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.781044	2026-02-24 14:54:15.781044	\N
5546	379	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.783081	2026-02-24 14:54:15.783081	\N
5547	379	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.784884	2026-02-24 14:54:15.784884	\N
5548	379	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.787009	2026-02-24 14:54:15.787009	\N
5549	379	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.788751	2026-02-24 14:54:15.788751	\N
5550	379	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.790663	2026-02-24 14:54:15.790663	\N
5551	379	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.792432	2026-02-24 14:54:15.792432	\N
5552	379	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.794234	2026-02-24 14:54:15.794234	\N
5553	379	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.797493	2026-02-24 14:54:15.797493	\N
5554	379	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.799467	2026-02-24 14:54:15.799467	\N
5555	380	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.802965	2026-02-24 14:54:15.802965	\N
5556	380	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.804822	2026-02-24 14:54:15.804822	\N
5557	380	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.80693	2026-02-24 14:54:15.80693	\N
5558	380	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.8088	2026-02-24 14:54:15.8088	\N
5559	380	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.810559	2026-02-24 14:54:15.810559	\N
5560	380	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.81338	2026-02-24 14:54:15.81338	\N
5561	380	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.815519	2026-02-24 14:54:15.815519	\N
5562	380	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.817636	2026-02-24 14:54:15.817636	\N
5563	380	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.820218	2026-02-24 14:54:15.820218	\N
5564	380	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.82218	2026-02-24 14:54:15.82218	\N
5565	381	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.825555	2026-02-24 14:54:15.825555	\N
5566	381	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.827484	2026-02-24 14:54:15.827484	\N
5567	381	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.830585	2026-02-24 14:54:15.830585	\N
5568	381	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.832837	2026-02-24 14:54:15.832837	\N
5569	381	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.834786	2026-02-24 14:54:15.834786	\N
5570	381	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.836599	2026-02-24 14:54:15.836599	\N
5571	381	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.838816	2026-02-24 14:54:15.838816	\N
5572	381	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.840673	2026-02-24 14:54:15.840673	\N
5573	381	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.842634	2026-02-24 14:54:15.842634	\N
5574	381	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.84459	2026-02-24 14:54:15.84459	\N
5575	382	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.849133	2026-02-24 14:54:15.849133	\N
5576	382	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.851018	2026-02-24 14:54:15.851018	\N
5577	382	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.852968	2026-02-24 14:54:15.852968	\N
5578	382	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.855289	2026-02-24 14:54:15.855289	\N
5579	382	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.85795	2026-02-24 14:54:15.85795	\N
5580	382	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.86023	2026-02-24 14:54:15.86023	\N
5581	382	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.87286	2026-02-24 14:54:15.87286	\N
5582	382	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.875076	2026-02-24 14:54:15.875076	\N
5583	382	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.877246	2026-02-24 14:54:15.877246	\N
5584	382	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.881742	2026-02-24 14:54:15.881742	\N
5585	383	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.885712	2026-02-24 14:54:15.885712	\N
5586	383	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.887995	2026-02-24 14:54:15.887995	\N
5587	383	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.890237	2026-02-24 14:54:15.890237	\N
5588	383	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.892277	2026-02-24 14:54:15.892277	\N
5589	383	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.894255	2026-02-24 14:54:15.894255	\N
5590	383	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.898199	2026-02-24 14:54:15.898199	\N
5591	383	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.900262	2026-02-24 14:54:15.900262	\N
5592	383	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.902042	2026-02-24 14:54:15.902042	\N
5593	383	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.903984	2026-02-24 14:54:15.903984	\N
5594	383	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.905778	2026-02-24 14:54:15.905778	\N
5595	313	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.90942	2026-02-24 14:54:15.90942	\N
5596	313	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.911342	2026-02-24 14:54:15.911342	\N
5597	313	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.914864	2026-02-24 14:54:15.914864	\N
5598	313	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.917094	2026-02-24 14:54:15.917094	\N
5599	313	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.919523	2026-02-24 14:54:15.919523	\N
5600	313	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.921805	2026-02-24 14:54:15.921805	\N
5601	313	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.924274	2026-02-24 14:54:15.924274	\N
5602	313	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.926575	2026-02-24 14:54:15.926575	\N
5603	313	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.930099	2026-02-24 14:54:15.930099	\N
5604	313	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.932246	2026-02-24 14:54:15.932246	\N
5605	385	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.938838	2026-02-24 14:54:15.938838	\N
5606	385	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.94101	2026-02-24 14:54:15.94101	\N
5607	385	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.942859	2026-02-24 14:54:15.942859	\N
5608	385	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.945058	2026-02-24 14:54:15.945058	\N
5609	385	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.948083	2026-02-24 14:54:15.948083	\N
5610	385	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.950241	2026-02-24 14:54:15.950241	\N
5611	385	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.952284	2026-02-24 14:54:15.952284	\N
5612	385	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.954159	2026-02-24 14:54:15.954159	\N
5613	385	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.956203	2026-02-24 14:54:15.956203	\N
5614	385	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.958272	2026-02-24 14:54:15.958272	\N
5615	386	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.961706	2026-02-24 14:54:15.961706	\N
5616	386	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.964754	2026-02-24 14:54:15.964754	\N
5617	386	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.966862	2026-02-24 14:54:15.966862	\N
5618	386	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:15.969036	2026-02-24 14:54:15.969036	\N
5619	386	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:15.971124	2026-02-24 14:54:15.971124	\N
5620	386	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:15.973029	2026-02-24 14:54:15.973029	\N
5621	386	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:15.975504	2026-02-24 14:54:15.975504	\N
5622	386	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:15.977747	2026-02-24 14:54:15.977747	\N
5623	386	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:15.981495	2026-02-24 14:54:15.981495	\N
5624	386	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:15.983568	2026-02-24 14:54:15.983568	\N
5625	387	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:15.986931	2026-02-24 14:54:15.986931	\N
5626	387	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:15.988916	2026-02-24 14:54:15.988916	\N
5627	387	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:15.994996	2026-02-24 14:54:15.994996	\N
5628	387	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.005593	2026-02-24 14:54:16.005593	\N
5629	387	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.007494	2026-02-24 14:54:16.007494	\N
5630	387	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.009392	2026-02-24 14:54:16.009392	\N
5631	387	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.011233	2026-02-24 14:54:16.011233	\N
5632	387	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.014195	2026-02-24 14:54:16.014195	\N
5633	387	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.016391	2026-02-24 14:54:16.016391	\N
5634	387	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.018358	2026-02-24 14:54:16.018358	\N
5635	314	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.022088	2026-02-24 14:54:16.022088	\N
5636	314	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.02414	2026-02-24 14:54:16.02414	\N
5637	314	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.026236	2026-02-24 14:54:16.026236	\N
5638	314	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.028094	2026-02-24 14:54:16.028094	\N
5639	314	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.031069	2026-02-24 14:54:16.031069	\N
5640	314	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.033067	2026-02-24 14:54:16.033067	\N
5641	314	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.034923	2026-02-24 14:54:16.034923	\N
5642	314	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.03713	2026-02-24 14:54:16.03713	\N
5643	314	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.039098	2026-02-24 14:54:16.039098	\N
5644	314	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.041567	2026-02-24 14:54:16.041567	\N
5645	388	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.045045	2026-02-24 14:54:16.045045	\N
5646	388	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.048121	2026-02-24 14:54:16.048121	\N
5647	388	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.05019	2026-02-24 14:54:16.05019	\N
5648	388	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.052211	2026-02-24 14:54:16.052211	\N
5649	388	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.053983	2026-02-24 14:54:16.053983	\N
5650	388	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.056311	2026-02-24 14:54:16.056311	\N
5651	388	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.059213	2026-02-24 14:54:16.059213	\N
5652	388	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.063171	2026-02-24 14:54:16.063171	\N
5653	388	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.068348	2026-02-24 14:54:16.068348	\N
5654	388	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.070562	2026-02-24 14:54:16.070562	\N
5655	389	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.074382	2026-02-24 14:54:16.074382	\N
5656	389	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.076553	2026-02-24 14:54:16.076553	\N
5657	389	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.079629	2026-02-24 14:54:16.079629	\N
5658	389	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.082912	2026-02-24 14:54:16.082912	\N
5659	389	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.085217	2026-02-24 14:54:16.085217	\N
5660	389	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.087389	2026-02-24 14:54:16.087389	\N
5661	389	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.08932	2026-02-24 14:54:16.08932	\N
5662	389	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.091069	2026-02-24 14:54:16.091069	\N
5663	389	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.09311	2026-02-24 14:54:16.09311	\N
5664	389	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.095039	2026-02-24 14:54:16.095039	\N
5665	390	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.099578	2026-02-24 14:54:16.099578	\N
5666	390	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.10162	2026-02-24 14:54:16.10162	\N
5667	390	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.10355	2026-02-24 14:54:16.10355	\N
5668	390	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.105316	2026-02-24 14:54:16.105316	\N
5669	390	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.107227	2026-02-24 14:54:16.107227	\N
5670	390	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.109176	2026-02-24 14:54:16.109176	\N
5671	390	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.110946	2026-02-24 14:54:16.110946	\N
5672	390	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.114163	2026-02-24 14:54:16.114163	\N
5673	390	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.116251	2026-02-24 14:54:16.116251	\N
5674	390	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.118249	2026-02-24 14:54:16.118249	\N
5675	391	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.121578	2026-02-24 14:54:16.121578	\N
5676	391	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.123546	2026-02-24 14:54:16.123546	\N
5677	391	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.125299	2026-02-24 14:54:16.125299	\N
5678	391	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.12715	2026-02-24 14:54:16.12715	\N
5679	391	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.130264	2026-02-24 14:54:16.130264	\N
5680	391	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.132419	2026-02-24 14:54:16.132419	\N
5681	391	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.134348	2026-02-24 14:54:16.134348	\N
5682	391	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.13619	2026-02-24 14:54:16.13619	\N
5683	391	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.138158	2026-02-24 14:54:16.138158	\N
5684	391	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.140108	2026-02-24 14:54:16.140108	\N
5685	392	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.143403	2026-02-24 14:54:16.143403	\N
5686	392	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.145919	2026-02-24 14:54:16.145919	\N
5687	392	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.148437	2026-02-24 14:54:16.148437	\N
5688	392	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.150275	2026-02-24 14:54:16.150275	\N
5689	392	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.151985	2026-02-24 14:54:16.151985	\N
5690	392	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.153828	2026-02-24 14:54:16.153828	\N
5691	392	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.15572	2026-02-24 14:54:16.15572	\N
5692	392	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.157652	2026-02-24 14:54:16.157652	\N
5693	392	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.159653	2026-02-24 14:54:16.159653	\N
5694	392	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.161426	2026-02-24 14:54:16.161426	\N
5695	393	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.166107	2026-02-24 14:54:16.166107	\N
5696	393	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.168003	2026-02-24 14:54:16.168003	\N
5697	393	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.170037	2026-02-24 14:54:16.170037	\N
5698	393	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.171792	2026-02-24 14:54:16.171792	\N
5699	393	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.173723	2026-02-24 14:54:16.173723	\N
5700	393	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.175576	2026-02-24 14:54:16.175576	\N
5701	393	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.177387	2026-02-24 14:54:16.177387	\N
5702	393	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.180343	2026-02-24 14:54:16.180343	\N
5703	393	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.182505	2026-02-24 14:54:16.182505	\N
5704	393	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.184535	2026-02-24 14:54:16.184535	\N
5705	394	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.193172	2026-02-24 14:54:16.193172	\N
5706	394	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.195184	2026-02-24 14:54:16.195184	\N
5707	394	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.19845	2026-02-24 14:54:16.19845	\N
5708	394	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.200598	2026-02-24 14:54:16.200598	\N
5709	394	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.202661	2026-02-24 14:54:16.202661	\N
5710	394	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.20555	2026-02-24 14:54:16.20555	\N
5711	394	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.208115	2026-02-24 14:54:16.208115	\N
5712	394	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.210043	2026-02-24 14:54:16.210043	\N
5713	394	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.212412	2026-02-24 14:54:16.212412	\N
5714	394	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.214955	2026-02-24 14:54:16.214955	\N
5715	395	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.21839	2026-02-24 14:54:16.21839	\N
5716	395	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.220293	2026-02-24 14:54:16.220293	\N
5717	395	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.222268	2026-02-24 14:54:16.222268	\N
5718	395	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.22419	2026-02-24 14:54:16.22419	\N
5719	395	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.226123	2026-02-24 14:54:16.226123	\N
5720	395	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.228778	2026-02-24 14:54:16.228778	\N
5721	395	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.231555	2026-02-24 14:54:16.231555	\N
5722	395	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.233512	2026-02-24 14:54:16.233512	\N
5723	395	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.235223	2026-02-24 14:54:16.235223	\N
5724	395	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.237437	2026-02-24 14:54:16.237437	\N
5725	397	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.240546	2026-02-24 14:54:16.240546	\N
5726	397	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.242454	2026-02-24 14:54:16.242454	\N
5727	397	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.244233	2026-02-24 14:54:16.244233	\N
5728	397	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.247729	2026-02-24 14:54:16.247729	\N
5729	397	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.249798	2026-02-24 14:54:16.249798	\N
5730	397	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.251755	2026-02-24 14:54:16.251755	\N
5731	397	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.253569	2026-02-24 14:54:16.253569	\N
5732	397	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.255392	2026-02-24 14:54:16.255392	\N
5733	397	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.258101	2026-02-24 14:54:16.258101	\N
5734	397	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.260675	2026-02-24 14:54:16.260675	\N
5735	398	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.265753	2026-02-24 14:54:16.265753	\N
5736	398	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.269477	2026-02-24 14:54:16.269477	\N
5737	398	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.271717	2026-02-24 14:54:16.271717	\N
5738	398	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.273922	2026-02-24 14:54:16.273922	\N
5739	398	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.275981	2026-02-24 14:54:16.275981	\N
5740	398	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.278252	2026-02-24 14:54:16.278252	\N
5741	398	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.281418	2026-02-24 14:54:16.281418	\N
5742	398	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.283896	2026-02-24 14:54:16.283896	\N
5743	398	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.286166	2026-02-24 14:54:16.286166	\N
5744	398	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.288257	2026-02-24 14:54:16.288257	\N
5745	399	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.291735	2026-02-24 14:54:16.291735	\N
5746	399	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.29384	2026-02-24 14:54:16.29384	\N
5747	399	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.297052	2026-02-24 14:54:16.297052	\N
5748	399	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.29942	2026-02-24 14:54:16.29942	\N
5749	399	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.301319	2026-02-24 14:54:16.301319	\N
5750	399	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.303062	2026-02-24 14:54:16.303062	\N
5751	399	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.304945	2026-02-24 14:54:16.304945	\N
5752	399	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.306756	2026-02-24 14:54:16.306756	\N
5753	399	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.308787	2026-02-24 14:54:16.308787	\N
5754	399	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.310642	2026-02-24 14:54:16.310642	\N
5755	400	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.315508	2026-02-24 14:54:16.315508	\N
5756	400	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.318744	2026-02-24 14:54:16.318744	\N
5757	400	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.32108	2026-02-24 14:54:16.32108	\N
5758	400	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.323146	2026-02-24 14:54:16.323146	\N
5759	400	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.325178	2026-02-24 14:54:16.325178	\N
5760	400	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.327146	2026-02-24 14:54:16.327146	\N
5761	400	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.33008	2026-02-24 14:54:16.33008	\N
5762	400	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.332362	2026-02-24 14:54:16.332362	\N
5763	400	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.334226	2026-02-24 14:54:16.334226	\N
5764	400	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.336457	2026-02-24 14:54:16.336457	\N
5765	401	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.339777	2026-02-24 14:54:16.339777	\N
5766	401	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.341696	2026-02-24 14:54:16.341696	\N
5767	401	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.343521	2026-02-24 14:54:16.343521	\N
5768	401	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.3463	2026-02-24 14:54:16.3463	\N
5769	401	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.348614	2026-02-24 14:54:16.348614	\N
5770	401	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.350587	2026-02-24 14:54:16.350587	\N
5771	401	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.352407	2026-02-24 14:54:16.352407	\N
5772	401	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.354113	2026-02-24 14:54:16.354113	\N
5773	401	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.356541	2026-02-24 14:54:16.356541	\N
5774	401	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.358776	2026-02-24 14:54:16.358776	\N
5775	402	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.363975	2026-02-24 14:54:16.363975	\N
5776	402	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.366801	2026-02-24 14:54:16.366801	\N
5777	402	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.368699	2026-02-24 14:54:16.368699	\N
5778	402	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.370434	2026-02-24 14:54:16.370434	\N
5779	402	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.372326	2026-02-24 14:54:16.372326	\N
5780	402	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.374089	2026-02-24 14:54:16.374089	\N
5781	402	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.375891	2026-02-24 14:54:16.375891	\N
5782	402	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.377953	2026-02-24 14:54:16.377953	\N
5783	402	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.381141	2026-02-24 14:54:16.381141	\N
5784	402	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.383271	2026-02-24 14:54:16.383271	\N
5785	403	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.386476	2026-02-24 14:54:16.386476	\N
5786	403	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.388299	2026-02-24 14:54:16.388299	\N
5787	403	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.390029	2026-02-24 14:54:16.390029	\N
5788	403	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.391906	2026-02-24 14:54:16.391906	\N
5789	403	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.393776	2026-02-24 14:54:16.393776	\N
5790	403	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.396563	2026-02-24 14:54:16.396563	\N
5791	403	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.39892	2026-02-24 14:54:16.39892	\N
5792	403	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.400767	2026-02-24 14:54:16.400767	\N
5793	403	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.402801	2026-02-24 14:54:16.402801	\N
5794	403	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.404599	2026-02-24 14:54:16.404599	\N
5795	404	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.408052	2026-02-24 14:54:16.408052	\N
5796	404	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.410036	2026-02-24 14:54:16.410036	\N
5797	404	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.412724	2026-02-24 14:54:16.412724	\N
5798	404	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.415202	2026-02-24 14:54:16.415202	\N
5799	404	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.417387	2026-02-24 14:54:16.417387	\N
5800	404	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.42006	2026-02-24 14:54:16.42006	\N
5801	404	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.422977	2026-02-24 14:54:16.422977	\N
5802	404	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.425507	2026-02-24 14:54:16.425507	\N
5803	404	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.427577	2026-02-24 14:54:16.427577	\N
5804	404	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.430714	2026-02-24 14:54:16.430714	\N
5805	405	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.434285	2026-02-24 14:54:16.434285	\N
5806	405	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.438399	2026-02-24 14:54:16.438399	\N
5807	405	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.442455	2026-02-24 14:54:16.442455	\N
5808	405	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.444226	2026-02-24 14:54:16.444226	\N
5809	405	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.447454	2026-02-24 14:54:16.447454	\N
5810	405	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.449494	2026-02-24 14:54:16.449494	\N
5811	405	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.451351	2026-02-24 14:54:16.451351	\N
5812	405	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.453171	2026-02-24 14:54:16.453171	\N
5813	405	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.454911	2026-02-24 14:54:16.454911	\N
5814	405	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.456969	2026-02-24 14:54:16.456969	\N
5815	406	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.461469	2026-02-24 14:54:16.461469	\N
5816	406	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.465975	2026-02-24 14:54:16.465975	\N
5817	406	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.472248	2026-02-24 14:54:16.472248	\N
5818	406	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.47547	2026-02-24 14:54:16.47547	\N
5819	406	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.477971	2026-02-24 14:54:16.477971	\N
5820	406	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.481253	2026-02-24 14:54:16.481253	\N
5821	406	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.483656	2026-02-24 14:54:16.483656	\N
5822	406	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.485809	2026-02-24 14:54:16.485809	\N
5823	406	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.489211	2026-02-24 14:54:16.489211	\N
5824	406	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.491872	2026-02-24 14:54:16.491872	\N
5825	407	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.496796	2026-02-24 14:54:16.496796	\N
5826	407	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.500124	2026-02-24 14:54:16.500124	\N
5827	407	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.501973	2026-02-24 14:54:16.501973	\N
5828	407	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.503676	2026-02-24 14:54:16.503676	\N
5829	407	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.50571	2026-02-24 14:54:16.50571	\N
5830	407	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.507625	2026-02-24 14:54:16.507625	\N
5831	407	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.510227	2026-02-24 14:54:16.510227	\N
5832	407	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.512781	2026-02-24 14:54:16.512781	\N
5833	407	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.515238	2026-02-24 14:54:16.515238	\N
5834	407	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.517518	2026-02-24 14:54:16.517518	\N
5835	491	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.520794	2026-02-24 14:54:16.520794	\N
5836	491	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.522535	2026-02-24 14:54:16.522535	\N
5837	491	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.524353	2026-02-24 14:54:16.524353	\N
5838	491	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.526282	2026-02-24 14:54:16.526282	\N
5839	491	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.527999	2026-02-24 14:54:16.527999	\N
5840	491	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.531239	2026-02-24 14:54:16.531239	\N
5841	491	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.533496	2026-02-24 14:54:16.533496	\N
5842	491	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.5357	2026-02-24 14:54:16.5357	\N
5843	491	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.537831	2026-02-24 14:54:16.537831	\N
5844	491	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.539555	2026-02-24 14:54:16.539555	\N
5845	492	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.542723	2026-02-24 14:54:16.542723	\N
5846	492	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.544481	2026-02-24 14:54:16.544481	\N
5847	492	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.547659	2026-02-24 14:54:16.547659	\N
5848	492	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.549612	2026-02-24 14:54:16.549612	\N
5849	492	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.551541	2026-02-24 14:54:16.551541	\N
5850	492	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.553279	2026-02-24 14:54:16.553279	\N
5851	492	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.554983	2026-02-24 14:54:16.554983	\N
5852	492	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.556981	2026-02-24 14:54:16.556981	\N
5853	492	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.558771	2026-02-24 14:54:16.558771	\N
5854	492	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.560611	2026-02-24 14:54:16.560611	\N
5855	493	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.5658	2026-02-24 14:54:16.5658	\N
5856	493	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.568698	2026-02-24 14:54:16.568698	\N
5857	493	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.575267	2026-02-24 14:54:16.575267	\N
5858	493	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.577778	2026-02-24 14:54:16.577778	\N
5859	493	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.581541	2026-02-24 14:54:16.581541	\N
5860	493	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.58353	2026-02-24 14:54:16.58353	\N
5861	493	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.585342	2026-02-24 14:54:16.585342	\N
5862	493	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.58719	2026-02-24 14:54:16.58719	\N
5863	493	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.588988	2026-02-24 14:54:16.588988	\N
5864	493	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.592027	2026-02-24 14:54:16.592027	\N
5865	494	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.599544	2026-02-24 14:54:16.599544	\N
5866	494	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.602818	2026-02-24 14:54:16.602818	\N
5867	494	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.605722	2026-02-24 14:54:16.605722	\N
5868	494	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.608799	2026-02-24 14:54:16.608799	\N
5869	494	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.611009	2026-02-24 14:54:16.611009	\N
5870	494	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.614151	2026-02-24 14:54:16.614151	\N
5871	494	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.616511	2026-02-24 14:54:16.616511	\N
5872	494	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.61881	2026-02-24 14:54:16.61881	\N
5873	494	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.621072	2026-02-24 14:54:16.621072	\N
5874	494	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.622817	2026-02-24 14:54:16.622817	\N
5875	495	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.626089	2026-02-24 14:54:16.626089	\N
5876	495	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.627841	2026-02-24 14:54:16.627841	\N
5877	495	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.630873	2026-02-24 14:54:16.630873	\N
5878	495	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.632715	2026-02-24 14:54:16.632715	\N
5879	495	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.634551	2026-02-24 14:54:16.634551	\N
5880	495	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.636333	2026-02-24 14:54:16.636333	\N
5881	495	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.638092	2026-02-24 14:54:16.638092	\N
5882	495	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.639928	2026-02-24 14:54:16.639928	\N
5883	495	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.641664	2026-02-24 14:54:16.641664	\N
5884	495	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.643606	2026-02-24 14:54:16.643606	\N
5885	496	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.647977	2026-02-24 14:54:16.647977	\N
5886	496	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.649946	2026-02-24 14:54:16.649946	\N
5887	496	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.651718	2026-02-24 14:54:16.651718	\N
5888	496	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.653529	2026-02-24 14:54:16.653529	\N
5889	496	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.65529	2026-02-24 14:54:16.65529	\N
5890	496	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.657416	2026-02-24 14:54:16.657416	\N
5891	496	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.659766	2026-02-24 14:54:16.659766	\N
5892	496	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.662922	2026-02-24 14:54:16.662922	\N
5893	496	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.665593	2026-02-24 14:54:16.665593	\N
5894	496	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.671871	2026-02-24 14:54:16.671871	\N
5895	497	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.6758	2026-02-24 14:54:16.6758	\N
5896	497	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.677955	2026-02-24 14:54:16.677955	\N
5897	497	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.680859	2026-02-24 14:54:16.680859	\N
5898	497	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.683248	2026-02-24 14:54:16.683248	\N
5899	497	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.685372	2026-02-24 14:54:16.685372	\N
5900	497	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.693776	2026-02-24 14:54:16.693776	\N
5901	497	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.697403	2026-02-24 14:54:16.697403	\N
5902	497	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.69944	2026-02-24 14:54:16.69944	\N
5903	497	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.701335	2026-02-24 14:54:16.701335	\N
5904	497	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.703044	2026-02-24 14:54:16.703044	\N
5905	498	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.706187	2026-02-24 14:54:16.706187	\N
5906	498	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.708002	2026-02-24 14:54:16.708002	\N
5907	498	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.709829	2026-02-24 14:54:16.709829	\N
5908	498	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.711667	2026-02-24 14:54:16.711667	\N
5909	498	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.714566	2026-02-24 14:54:16.714566	\N
5910	498	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.716637	2026-02-24 14:54:16.716637	\N
5911	498	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.718446	2026-02-24 14:54:16.718446	\N
5912	498	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.720393	2026-02-24 14:54:16.720393	\N
5913	498	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.722165	2026-02-24 14:54:16.722165	\N
5914	498	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.723873	2026-02-24 14:54:16.723873	\N
5915	499	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.726981	2026-02-24 14:54:16.726981	\N
5916	499	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.72943	2026-02-24 14:54:16.72943	\N
5917	499	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.731775	2026-02-24 14:54:16.731775	\N
5918	499	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.733637	2026-02-24 14:54:16.733637	\N
5919	499	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.735813	2026-02-24 14:54:16.735813	\N
5920	499	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.737668	2026-02-24 14:54:16.737668	\N
5921	499	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.739491	2026-02-24 14:54:16.739491	\N
5922	499	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.741279	2026-02-24 14:54:16.741279	\N
5923	499	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.743028	2026-02-24 14:54:16.743028	\N
5924	499	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.744908	2026-02-24 14:54:16.744908	\N
5925	500	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.74916	2026-02-24 14:54:16.74916	\N
5926	500	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.751048	2026-02-24 14:54:16.751048	\N
5927	500	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.752785	2026-02-24 14:54:16.752785	\N
5928	500	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.754707	2026-02-24 14:54:16.754707	\N
5929	500	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.756565	2026-02-24 14:54:16.756565	\N
5930	500	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.758341	2026-02-24 14:54:16.758341	\N
5931	500	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.76019	2026-02-24 14:54:16.76019	\N
5932	500	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.762638	2026-02-24 14:54:16.762638	\N
5933	500	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.765632	2026-02-24 14:54:16.765632	\N
5934	500	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.767705	2026-02-24 14:54:16.767705	\N
5935	501	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.770956	2026-02-24 14:54:16.770956	\N
5936	501	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.772682	2026-02-24 14:54:16.772682	\N
5937	501	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.774345	2026-02-24 14:54:16.774345	\N
5938	501	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.776433	2026-02-24 14:54:16.776433	\N
5939	501	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.778338	2026-02-24 14:54:16.778338	\N
5940	501	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.781361	2026-02-24 14:54:16.781361	\N
5941	501	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.783262	2026-02-24 14:54:16.783262	\N
5942	501	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.784993	2026-02-24 14:54:16.784993	\N
5943	501	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.786894	2026-02-24 14:54:16.786894	\N
5944	501	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.788584	2026-02-24 14:54:16.788584	\N
5945	502	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.791622	2026-02-24 14:54:16.791622	\N
5946	502	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.793408	2026-02-24 14:54:16.793408	\N
5947	502	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.795682	2026-02-24 14:54:16.795682	\N
5948	502	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.798332	2026-02-24 14:54:16.798332	\N
5949	502	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.800214	2026-02-24 14:54:16.800214	\N
5950	502	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.802075	2026-02-24 14:54:16.802075	\N
5951	502	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.803747	2026-02-24 14:54:16.803747	\N
5952	502	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.805661	2026-02-24 14:54:16.805661	\N
5953	502	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.807513	2026-02-24 14:54:16.807513	\N
5954	502	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.809267	2026-02-24 14:54:16.809267	\N
5955	503	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.813697	2026-02-24 14:54:16.813697	\N
5956	503	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.815821	2026-02-24 14:54:16.815821	\N
5957	503	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.817765	2026-02-24 14:54:16.817765	\N
5958	503	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.819488	2026-02-24 14:54:16.819488	\N
5959	503	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.821315	2026-02-24 14:54:16.821315	\N
5960	503	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.823032	2026-02-24 14:54:16.823032	\N
5961	503	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.824712	2026-02-24 14:54:16.824712	\N
5962	503	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.826578	2026-02-24 14:54:16.826578	\N
5963	503	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.831893	2026-02-24 14:54:16.831893	\N
5964	503	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.834195	2026-02-24 14:54:16.834195	\N
5965	504	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.837378	2026-02-24 14:54:16.837378	\N
5966	504	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.839162	2026-02-24 14:54:16.839162	\N
5967	504	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.840871	2026-02-24 14:54:16.840871	\N
5968	504	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.842815	2026-02-24 14:54:16.842815	\N
5969	504	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.845567	2026-02-24 14:54:16.845567	\N
5970	504	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.84857	2026-02-24 14:54:16.84857	\N
5971	504	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.850355	2026-02-24 14:54:16.850355	\N
5972	504	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.852157	2026-02-24 14:54:16.852157	\N
5973	504	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.853995	2026-02-24 14:54:16.853995	\N
5974	504	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.855855	2026-02-24 14:54:16.855855	\N
5975	505	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.860084	2026-02-24 14:54:16.860084	\N
5976	505	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.864368	2026-02-24 14:54:16.864368	\N
5977	505	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.866804	2026-02-24 14:54:16.866804	\N
5978	505	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.874212	2026-02-24 14:54:16.874212	\N
5979	505	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.877441	2026-02-24 14:54:16.877441	\N
5980	505	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.880819	2026-02-24 14:54:16.880819	\N
5981	505	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.883027	2026-02-24 14:54:16.883027	\N
5982	505	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.885127	2026-02-24 14:54:16.885127	\N
5983	505	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.88712	2026-02-24 14:54:16.88712	\N
5984	505	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.889559	2026-02-24 14:54:16.889559	\N
5985	506	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.893143	2026-02-24 14:54:16.893143	\N
5986	506	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.895365	2026-02-24 14:54:16.895365	\N
5987	506	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.898146	2026-02-24 14:54:16.898146	\N
5988	506	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.900134	2026-02-24 14:54:16.900134	\N
5989	506	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.901881	2026-02-24 14:54:16.901881	\N
5990	506	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.90354	2026-02-24 14:54:16.90354	\N
5991	506	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.905884	2026-02-24 14:54:16.905884	\N
5992	506	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.907657	2026-02-24 14:54:16.907657	\N
5993	506	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.909503	2026-02-24 14:54:16.909503	\N
5994	506	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.911285	2026-02-24 14:54:16.911285	\N
5995	507	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.915587	2026-02-24 14:54:16.915587	\N
5996	507	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.917408	2026-02-24 14:54:16.917408	\N
5997	507	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.919244	2026-02-24 14:54:16.919244	\N
5998	507	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.921331	2026-02-24 14:54:16.921331	\N
5999	507	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.923164	2026-02-24 14:54:16.923164	\N
6000	507	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.925026	2026-02-24 14:54:16.925026	\N
6001	507	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.926856	2026-02-24 14:54:16.926856	\N
6002	507	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.929146	2026-02-24 14:54:16.929146	\N
6003	507	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.931807	2026-02-24 14:54:16.931807	\N
6004	507	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.933605	2026-02-24 14:54:16.933605	\N
6005	508	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.937169	2026-02-24 14:54:16.937169	\N
6006	508	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.941399	2026-02-24 14:54:16.941399	\N
6007	508	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.943249	2026-02-24 14:54:16.943249	\N
6008	508	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.945117	2026-02-24 14:54:16.945117	\N
6009	508	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.948095	2026-02-24 14:54:16.948095	\N
6010	508	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.949978	2026-02-24 14:54:16.949978	\N
6011	508	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.951888	2026-02-24 14:54:16.951888	\N
6012	508	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.953629	2026-02-24 14:54:16.953629	\N
6013	508	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.95548	2026-02-24 14:54:16.95548	\N
6014	508	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.957378	2026-02-24 14:54:16.957378	\N
6015	509	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.960402	2026-02-24 14:54:16.960402	\N
6016	509	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.963014	2026-02-24 14:54:16.963014	\N
6017	509	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.965278	2026-02-24 14:54:16.965278	\N
6018	509	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.967256	2026-02-24 14:54:16.967256	\N
6019	509	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.969119	2026-02-24 14:54:16.969119	\N
6020	509	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.97118	2026-02-24 14:54:16.97118	\N
6021	509	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.97294	2026-02-24 14:54:16.97294	\N
6022	509	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.974625	2026-02-24 14:54:16.974625	\N
6023	509	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.976565	2026-02-24 14:54:16.976565	\N
6024	509	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:16.978384	2026-02-24 14:54:16.978384	\N
6025	510	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:16.982866	2026-02-24 14:54:16.982866	\N
6026	510	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:16.984696	2026-02-24 14:54:16.984696	\N
6027	510	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:16.986655	2026-02-24 14:54:16.986655	\N
6028	510	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:16.988401	2026-02-24 14:54:16.988401	\N
6029	510	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:16.990124	2026-02-24 14:54:16.990124	\N
6030	510	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:16.991916	2026-02-24 14:54:16.991916	\N
6031	510	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:16.993612	2026-02-24 14:54:16.993612	\N
6032	510	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:16.996389	2026-02-24 14:54:16.996389	\N
6033	510	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:16.998941	2026-02-24 14:54:16.998941	\N
6034	510	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.0012	2026-02-24 14:54:17.0012	\N
6035	511	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.004633	2026-02-24 14:54:17.004633	\N
6036	511	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.006596	2026-02-24 14:54:17.006596	\N
6037	511	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.008386	2026-02-24 14:54:17.008386	\N
6038	511	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.010199	2026-02-24 14:54:17.010199	\N
6039	511	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.012517	2026-02-24 14:54:17.012517	\N
6040	511	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.014959	2026-02-24 14:54:17.014959	\N
6041	511	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.016984	2026-02-24 14:54:17.016984	\N
6042	511	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.018766	2026-02-24 14:54:17.018766	\N
6043	511	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.020717	2026-02-24 14:54:17.020717	\N
6044	511	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.022697	2026-02-24 14:54:17.022697	\N
6045	512	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.026124	2026-02-24 14:54:17.026124	\N
6046	512	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.028123	2026-02-24 14:54:17.028123	\N
6047	512	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.031006	2026-02-24 14:54:17.031006	\N
6048	512	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.03311	2026-02-24 14:54:17.03311	\N
6049	512	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.034878	2026-02-24 14:54:17.034878	\N
6050	512	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.036871	2026-02-24 14:54:17.036871	\N
6051	512	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.038598	2026-02-24 14:54:17.038598	\N
6052	512	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.040403	2026-02-24 14:54:17.040403	\N
6053	512	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.042146	2026-02-24 14:54:17.042146	\N
6054	512	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.043845	2026-02-24 14:54:17.043845	\N
6055	513	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.048315	2026-02-24 14:54:17.048315	\N
6056	513	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.050215	2026-02-24 14:54:17.050215	\N
6057	513	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.052049	2026-02-24 14:54:17.052049	\N
6058	513	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.053757	2026-02-24 14:54:17.053757	\N
6059	513	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.055736	2026-02-24 14:54:17.055736	\N
6060	513	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.057653	2026-02-24 14:54:17.057653	\N
6061	513	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.059726	2026-02-24 14:54:17.059726	\N
6062	513	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.063145	2026-02-24 14:54:17.063145	\N
6063	513	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.066088	2026-02-24 14:54:17.066088	\N
6064	513	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.072455	2026-02-24 14:54:17.072455	\N
6065	514	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.075926	2026-02-24 14:54:17.075926	\N
6066	514	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.078149	2026-02-24 14:54:17.078149	\N
6067	514	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.081164	2026-02-24 14:54:17.081164	\N
6068	514	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.083296	2026-02-24 14:54:17.083296	\N
6069	514	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.085197	2026-02-24 14:54:17.085197	\N
6070	514	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.087438	2026-02-24 14:54:17.087438	\N
6071	514	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.089541	2026-02-24 14:54:17.089541	\N
6072	514	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.091409	2026-02-24 14:54:17.091409	\N
6073	514	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.093376	2026-02-24 14:54:17.093376	\N
6074	514	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.095504	2026-02-24 14:54:17.095504	\N
6075	515	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.099644	2026-02-24 14:54:17.099644	\N
6076	515	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.101402	2026-02-24 14:54:17.101402	\N
6077	515	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.10323	2026-02-24 14:54:17.10323	\N
6078	515	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.104974	2026-02-24 14:54:17.104974	\N
6079	515	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.106684	2026-02-24 14:54:17.106684	\N
6080	515	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.108674	2026-02-24 14:54:17.108674	\N
6081	515	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.110566	2026-02-24 14:54:17.110566	\N
6082	515	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.113201	2026-02-24 14:54:17.113201	\N
6083	515	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.115503	2026-02-24 14:54:17.115503	\N
6084	515	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.117435	2026-02-24 14:54:17.117435	\N
6085	516	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.120513	2026-02-24 14:54:17.120513	\N
6086	516	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.122337	2026-02-24 14:54:17.122337	\N
6087	516	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.124209	2026-02-24 14:54:17.124209	\N
6088	516	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.125922	2026-02-24 14:54:17.125922	\N
6089	516	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.12776	2026-02-24 14:54:17.12776	\N
6090	516	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.130613	2026-02-24 14:54:17.130613	\N
6091	516	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.132665	2026-02-24 14:54:17.132665	\N
6092	516	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.134507	2026-02-24 14:54:17.134507	\N
6093	516	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.136242	2026-02-24 14:54:17.136242	\N
6094	516	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.138107	2026-02-24 14:54:17.138107	\N
6095	517	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.141147	2026-02-24 14:54:17.141147	\N
6096	517	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.143013	2026-02-24 14:54:17.143013	\N
6097	517	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.145024	2026-02-24 14:54:17.145024	\N
6098	517	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.147956	2026-02-24 14:54:17.147956	\N
6099	517	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.149832	2026-02-24 14:54:17.149832	\N
6100	517	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.151557	2026-02-24 14:54:17.151557	\N
6101	517	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.153394	2026-02-24 14:54:17.153394	\N
6102	517	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.15513	2026-02-24 14:54:17.15513	\N
6103	517	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.156826	2026-02-24 14:54:17.156826	\N
6104	517	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.158716	2026-02-24 14:54:17.158716	\N
6105	518	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.161706	2026-02-24 14:54:17.161706	\N
6106	518	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.164688	2026-02-24 14:54:17.164688	\N
6107	518	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.166532	2026-02-24 14:54:17.166532	\N
6108	518	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.168459	2026-02-24 14:54:17.168459	\N
6109	518	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.170193	2026-02-24 14:54:17.170193	\N
6110	518	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.171857	2026-02-24 14:54:17.171857	\N
6111	518	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.17374	2026-02-24 14:54:17.17374	\N
6112	518	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.175547	2026-02-24 14:54:17.175547	\N
6113	518	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.177338	2026-02-24 14:54:17.177338	\N
6114	518	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.180268	2026-02-24 14:54:17.180268	\N
6115	519	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.183698	2026-02-24 14:54:17.183698	\N
6116	519	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.185501	2026-02-24 14:54:17.185501	\N
6117	519	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.187317	2026-02-24 14:54:17.187317	\N
6118	519	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.192958	2026-02-24 14:54:17.192958	\N
6119	519	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.195834	2026-02-24 14:54:17.195834	\N
6120	519	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.198364	2026-02-24 14:54:17.198364	\N
6121	519	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.200217	2026-02-24 14:54:17.200217	\N
6122	519	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.201979	2026-02-24 14:54:17.201979	\N
6123	519	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.203802	2026-02-24 14:54:17.203802	\N
6124	519	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.205498	2026-02-24 14:54:17.205498	\N
6125	520	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.208637	2026-02-24 14:54:17.208637	\N
6126	520	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.210393	2026-02-24 14:54:17.210393	\N
6127	520	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.212941	2026-02-24 14:54:17.212941	\N
6128	520	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.215277	2026-02-24 14:54:17.215277	\N
6129	520	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.217526	2026-02-24 14:54:17.217526	\N
6130	520	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.219363	2026-02-24 14:54:17.219363	\N
6131	520	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.221031	2026-02-24 14:54:17.221031	\N
6132	520	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.222912	2026-02-24 14:54:17.222912	\N
6133	520	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.224671	2026-02-24 14:54:17.224671	\N
6134	520	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.226536	2026-02-24 14:54:17.226536	\N
6135	521	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.230746	2026-02-24 14:54:17.230746	\N
6136	521	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.23299	2026-02-24 14:54:17.23299	\N
6137	521	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.234839	2026-02-24 14:54:17.234839	\N
6138	521	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.23672	2026-02-24 14:54:17.23672	\N
6139	521	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.238578	2026-02-24 14:54:17.238578	\N
6140	521	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.240272	2026-02-24 14:54:17.240272	\N
6141	521	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.241978	2026-02-24 14:54:17.241978	\N
6142	521	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.243824	2026-02-24 14:54:17.243824	\N
6143	521	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.246675	2026-02-24 14:54:17.246675	\N
6144	521	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.248899	2026-02-24 14:54:17.248899	\N
6145	522	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.251926	2026-02-24 14:54:17.251926	\N
6146	522	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.253863	2026-02-24 14:54:17.253863	\N
6147	522	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.25557	2026-02-24 14:54:17.25557	\N
6148	522	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.257549	2026-02-24 14:54:17.257549	\N
6149	522	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.259875	2026-02-24 14:54:17.259875	\N
6150	522	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.2632	2026-02-24 14:54:17.2632	\N
6151	522	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.26612	2026-02-24 14:54:17.26612	\N
6152	522	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.268371	2026-02-24 14:54:17.268371	\N
6153	522	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.273859	2026-02-24 14:54:17.273859	\N
6154	522	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.275996	2026-02-24 14:54:17.275996	\N
6155	523	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.281012	2026-02-24 14:54:17.281012	\N
6156	523	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.284167	2026-02-24 14:54:17.284167	\N
6157	523	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.286122	2026-02-24 14:54:17.286122	\N
6158	523	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.288023	2026-02-24 14:54:17.288023	\N
6159	523	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.290207	2026-02-24 14:54:17.290207	\N
6160	523	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.292167	2026-02-24 14:54:17.292167	\N
6161	523	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.294153	2026-02-24 14:54:17.294153	\N
6162	523	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.297207	2026-02-24 14:54:17.297207	\N
6163	523	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.299205	2026-02-24 14:54:17.299205	\N
6164	523	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.301007	2026-02-24 14:54:17.301007	\N
6165	524	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.304265	2026-02-24 14:54:17.304265	\N
6166	524	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.30608	2026-02-24 14:54:17.30608	\N
6167	524	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.307913	2026-02-24 14:54:17.307913	\N
6168	524	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.309786	2026-02-24 14:54:17.309786	\N
6169	524	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.311659	2026-02-24 14:54:17.311659	\N
6170	524	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.314498	2026-02-24 14:54:17.314498	\N
6171	524	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.316434	2026-02-24 14:54:17.316434	\N
6172	524	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.318199	2026-02-24 14:54:17.318199	\N
6173	524	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.320207	2026-02-24 14:54:17.320207	\N
6174	524	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.321984	2026-02-24 14:54:17.321984	\N
6175	525	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.324991	2026-02-24 14:54:17.324991	\N
6176	525	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.326957	2026-02-24 14:54:17.326957	\N
6177	525	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.329289	2026-02-24 14:54:17.329289	\N
6178	525	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.331713	2026-02-24 14:54:17.331713	\N
6179	525	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.333529	2026-02-24 14:54:17.333529	\N
6180	525	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.335428	2026-02-24 14:54:17.335428	\N
6181	525	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.337284	2026-02-24 14:54:17.337284	\N
6182	525	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.338959	2026-02-24 14:54:17.338959	\N
6183	525	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.340904	2026-02-24 14:54:17.340904	\N
6184	525	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.342672	2026-02-24 14:54:17.342672	\N
6185	526	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.346848	2026-02-24 14:54:17.346848	\N
6186	526	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.348794	2026-02-24 14:54:17.348794	\N
6187	526	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.350699	2026-02-24 14:54:17.350699	\N
6188	526	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.352404	2026-02-24 14:54:17.352404	\N
6189	526	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.354123	2026-02-24 14:54:17.354123	\N
6190	526	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.356001	2026-02-24 14:54:17.356001	\N
6191	526	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.357787	2026-02-24 14:54:17.357787	\N
6192	526	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.359733	2026-02-24 14:54:17.359733	\N
6193	526	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.36153	2026-02-24 14:54:17.36153	\N
6194	526	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.364374	2026-02-24 14:54:17.364374	\N
6195	527	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.367741	2026-02-24 14:54:17.367741	\N
6196	527	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.369711	2026-02-24 14:54:17.369711	\N
6197	527	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.371438	2026-02-24 14:54:17.371438	\N
6198	527	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.373211	2026-02-24 14:54:17.373211	\N
6199	527	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.375142	2026-02-24 14:54:17.375142	\N
6200	527	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.377018	2026-02-24 14:54:17.377018	\N
6201	527	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.379401	2026-02-24 14:54:17.379401	\N
6202	527	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.381981	2026-02-24 14:54:17.381981	\N
6203	527	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.383845	2026-02-24 14:54:17.383845	\N
6204	527	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.385654	2026-02-24 14:54:17.385654	\N
6205	528	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.38872	2026-02-24 14:54:17.38872	\N
6206	528	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.39059	2026-02-24 14:54:17.39059	\N
6207	528	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.392305	2026-02-24 14:54:17.392305	\N
6208	528	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.394027	2026-02-24 14:54:17.394027	\N
6209	528	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.397022	2026-02-24 14:54:17.397022	\N
6210	528	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.399056	2026-02-24 14:54:17.399056	\N
6211	528	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.40095	2026-02-24 14:54:17.40095	\N
6212	528	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.402633	2026-02-24 14:54:17.402633	\N
6213	528	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.40441	2026-02-24 14:54:17.40441	\N
6214	528	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.406218	2026-02-24 14:54:17.406218	\N
6215	529	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.409266	2026-02-24 14:54:17.409266	\N
6216	529	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.411019	2026-02-24 14:54:17.411019	\N
6217	529	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.413862	2026-02-24 14:54:17.413862	\N
6218	529	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.415995	2026-02-24 14:54:17.415995	\N
6219	529	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.417837	2026-02-24 14:54:17.417837	\N
6220	529	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.420178	2026-02-24 14:54:17.420178	\N
6221	529	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.42197	2026-02-24 14:54:17.42197	\N
6222	529	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.42364	2026-02-24 14:54:17.42364	\N
6223	529	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.425535	2026-02-24 14:54:17.425535	\N
6224	529	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.42727	2026-02-24 14:54:17.42727	\N
6225	530	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.431667	2026-02-24 14:54:17.431667	\N
6226	530	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.433493	2026-02-24 14:54:17.433493	\N
6227	530	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.43527	2026-02-24 14:54:17.43527	\N
6228	530	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.437279	2026-02-24 14:54:17.437279	\N
6229	530	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.444145	2026-02-24 14:54:17.444145	\N
6230	530	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.447459	2026-02-24 14:54:17.447459	\N
6231	530	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.449531	2026-02-24 14:54:17.449531	\N
6232	530	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.45142	2026-02-24 14:54:17.45142	\N
6233	530	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.453224	2026-02-24 14:54:17.453224	\N
6234	530	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.455305	2026-02-24 14:54:17.455305	\N
6235	531	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.458625	2026-02-24 14:54:17.458625	\N
6236	531	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.461151	2026-02-24 14:54:17.461151	\N
6237	531	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.464551	2026-02-24 14:54:17.464551	\N
6238	531	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.466925	2026-02-24 14:54:17.466925	\N
6239	531	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.472751	2026-02-24 14:54:17.472751	\N
6240	531	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.474836	2026-02-24 14:54:17.474836	\N
6241	531	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.476911	2026-02-24 14:54:17.476911	\N
6242	531	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.479925	2026-02-24 14:54:17.479925	\N
6243	531	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.48244	2026-02-24 14:54:17.48244	\N
6244	531	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.4845	2026-02-24 14:54:17.4845	\N
6245	532	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.488167	2026-02-24 14:54:17.488167	\N
6246	532	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.490312	2026-02-24 14:54:17.490312	\N
6247	532	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.492236	2026-02-24 14:54:17.492236	\N
6248	532	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.494158	2026-02-24 14:54:17.494158	\N
6249	532	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.497299	2026-02-24 14:54:17.497299	\N
6250	532	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.499486	2026-02-24 14:54:17.499486	\N
6251	532	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.501232	2026-02-24 14:54:17.501232	\N
6252	532	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.503225	2026-02-24 14:54:17.503225	\N
6253	532	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.504974	2026-02-24 14:54:17.504974	\N
6254	532	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.506748	2026-02-24 14:54:17.506748	\N
6255	533	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.509919	2026-02-24 14:54:17.509919	\N
6256	533	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.51174	2026-02-24 14:54:17.51174	\N
6257	533	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.514913	2026-02-24 14:54:17.514913	\N
6258	533	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.517177	2026-02-24 14:54:17.517177	\N
6259	533	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.519599	2026-02-24 14:54:17.519599	\N
6260	533	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.52153	2026-02-24 14:54:17.52153	\N
6261	533	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.523637	2026-02-24 14:54:17.523637	\N
6262	533	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.5254	2026-02-24 14:54:17.5254	\N
6263	533	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.527232	2026-02-24 14:54:17.527232	\N
6264	533	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.530184	2026-02-24 14:54:17.530184	\N
6265	534	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.533652	2026-02-24 14:54:17.533652	\N
6266	534	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.535463	2026-02-24 14:54:17.535463	\N
6267	534	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.537323	2026-02-24 14:54:17.537323	\N
6268	534	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.539083	2026-02-24 14:54:17.539083	\N
6269	534	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.540752	2026-02-24 14:54:17.540752	\N
6270	534	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.542491	2026-02-24 14:54:17.542491	\N
6271	534	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.544344	2026-02-24 14:54:17.544344	\N
6272	534	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.547923	2026-02-24 14:54:17.547923	\N
6273	534	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.549929	2026-02-24 14:54:17.549929	\N
6274	534	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.551615	2026-02-24 14:54:17.551615	\N
6275	535	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.554734	2026-02-24 14:54:17.554734	\N
6276	535	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.556469	2026-02-24 14:54:17.556469	\N
6277	535	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.558442	2026-02-24 14:54:17.558442	\N
6278	535	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.560309	2026-02-24 14:54:17.560309	\N
6279	535	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.562769	2026-02-24 14:54:17.562769	\N
6280	535	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.565158	2026-02-24 14:54:17.565158	\N
6281	535	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.567037	2026-02-24 14:54:17.567037	\N
6282	535	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.568979	2026-02-24 14:54:17.568979	\N
6283	535	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.570764	2026-02-24 14:54:17.570764	\N
6284	535	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.572437	2026-02-24 14:54:17.572437	\N
6285	536	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.575806	2026-02-24 14:54:17.575806	\N
6286	536	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.577738	2026-02-24 14:54:17.577738	\N
6287	536	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.580809	2026-02-24 14:54:17.580809	\N
6288	536	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.582802	2026-02-24 14:54:17.582802	\N
6289	536	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.584679	2026-02-24 14:54:17.584679	\N
6290	536	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.586409	2026-02-24 14:54:17.586409	\N
6291	536	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.588177	2026-02-24 14:54:17.588177	\N
6292	536	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.590022	2026-02-24 14:54:17.590022	\N
6293	536	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.59182	2026-02-24 14:54:17.59182	\N
6294	536	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.593828	2026-02-24 14:54:17.593828	\N
6295	537	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.598327	2026-02-24 14:54:17.598327	\N
6296	537	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.600223	2026-02-24 14:54:17.600223	\N
6297	537	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.601894	2026-02-24 14:54:17.601894	\N
6298	537	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.603708	2026-02-24 14:54:17.603708	\N
6299	537	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.605518	2026-02-24 14:54:17.605518	\N
6300	537	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.607535	2026-02-24 14:54:17.607535	\N
6301	537	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.609671	2026-02-24 14:54:17.609671	\N
6302	537	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.611454	2026-02-24 14:54:17.611454	\N
6303	537	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.614514	2026-02-24 14:54:17.614514	\N
6304	537	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.616442	2026-02-24 14:54:17.616442	\N
6305	538	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.619538	2026-02-24 14:54:17.619538	\N
6306	538	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.621382	2026-02-24 14:54:17.621382	\N
6307	538	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.623154	2026-02-24 14:54:17.623154	\N
6308	538	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.625033	2026-02-24 14:54:17.625033	\N
6309	538	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.6268	2026-02-24 14:54:17.6268	\N
6310	538	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.62899	2026-02-24 14:54:17.62899	\N
6311	538	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.631758	2026-02-24 14:54:17.631758	\N
6312	538	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.633604	2026-02-24 14:54:17.633604	\N
6313	538	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.635542	2026-02-24 14:54:17.635542	\N
6314	538	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.637325	2026-02-24 14:54:17.637325	\N
6315	539	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.64057	2026-02-24 14:54:17.64057	\N
6316	539	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.642373	2026-02-24 14:54:17.642373	\N
6317	539	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.644215	2026-02-24 14:54:17.644215	\N
6318	539	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.647365	2026-02-24 14:54:17.647365	\N
6319	539	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.649379	2026-02-24 14:54:17.649379	\N
6320	539	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.651203	2026-02-24 14:54:17.651203	\N
6321	539	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.652891	2026-02-24 14:54:17.652891	\N
6322	539	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.654788	2026-02-24 14:54:17.654788	\N
6323	539	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.656614	2026-02-24 14:54:17.656614	\N
6324	539	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.65839	2026-02-24 14:54:17.65839	\N
6325	540	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.662878	2026-02-24 14:54:17.662878	\N
6326	540	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.665885	2026-02-24 14:54:17.665885	\N
6327	540	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.668418	2026-02-24 14:54:17.668418	\N
6328	540	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.670359	2026-02-24 14:54:17.670359	\N
6329	540	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.6749	2026-02-24 14:54:17.6749	\N
6330	540	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.677298	2026-02-24 14:54:17.677298	\N
6331	540	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.680335	2026-02-24 14:54:17.680335	\N
6332	540	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.682668	2026-02-24 14:54:17.682668	\N
6333	540	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.684917	2026-02-24 14:54:17.684917	\N
6334	540	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.687015	2026-02-24 14:54:17.687015	\N
6335	541	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.695714	2026-02-24 14:54:17.695714	\N
6336	541	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.698384	2026-02-24 14:54:17.698384	\N
6337	541	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.700413	2026-02-24 14:54:17.700413	\N
6338	541	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.702267	2026-02-24 14:54:17.702267	\N
6339	541	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.704037	2026-02-24 14:54:17.704037	\N
6340	541	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.705928	2026-02-24 14:54:17.705928	\N
6341	541	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.707639	2026-02-24 14:54:17.707639	\N
6342	541	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.709548	2026-02-24 14:54:17.709548	\N
6343	541	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.711353	2026-02-24 14:54:17.711353	\N
6344	541	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.714274	2026-02-24 14:54:17.714274	\N
6345	542	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.71766	2026-02-24 14:54:17.71766	\N
6346	542	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.719718	2026-02-24 14:54:17.719718	\N
6347	542	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.721608	2026-02-24 14:54:17.721608	\N
6348	542	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.723302	2026-02-24 14:54:17.723302	\N
6349	542	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.72514	2026-02-24 14:54:17.72514	\N
6350	542	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.726965	2026-02-24 14:54:17.726965	\N
6351	542	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.729307	2026-02-24 14:54:17.729307	\N
6352	542	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.731986	2026-02-24 14:54:17.731986	\N
6353	542	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.733903	2026-02-24 14:54:17.733903	\N
6354	542	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.735931	2026-02-24 14:54:17.735931	\N
6355	543	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.739325	2026-02-24 14:54:17.739325	\N
6356	543	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.741325	2026-02-24 14:54:17.741325	\N
6357	543	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.74306	2026-02-24 14:54:17.74306	\N
6358	543	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.744917	2026-02-24 14:54:17.744917	\N
6359	543	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.747779	2026-02-24 14:54:17.747779	\N
6360	543	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.749817	2026-02-24 14:54:17.749817	\N
6361	543	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.751616	2026-02-24 14:54:17.751616	\N
6362	543	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.753316	2026-02-24 14:54:17.753316	\N
6363	543	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.755135	2026-02-24 14:54:17.755135	\N
6364	543	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.757011	2026-02-24 14:54:17.757011	\N
6365	544	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.760371	2026-02-24 14:54:17.760371	\N
6366	544	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.763349	2026-02-24 14:54:17.763349	\N
6367	544	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.765864	2026-02-24 14:54:17.765864	\N
6368	544	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.767843	2026-02-24 14:54:17.767843	\N
6369	544	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.7696	2026-02-24 14:54:17.7696	\N
6370	544	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.771491	2026-02-24 14:54:17.771491	\N
6371	544	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.773219	2026-02-24 14:54:17.773219	\N
6372	544	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.774887	2026-02-24 14:54:17.774887	\N
6373	544	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.776919	2026-02-24 14:54:17.776919	\N
6374	544	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.779268	2026-02-24 14:54:17.779268	\N
6375	545	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.783035	2026-02-24 14:54:17.783035	\N
6376	545	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.784804	2026-02-24 14:54:17.784804	\N
6377	545	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.786774	2026-02-24 14:54:17.786774	\N
6378	545	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.788524	2026-02-24 14:54:17.788524	\N
6379	545	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.790223	2026-02-24 14:54:17.790223	\N
6380	545	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.792034	2026-02-24 14:54:17.792034	\N
6381	545	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.793854	2026-02-24 14:54:17.793854	\N
6382	545	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.7968	2026-02-24 14:54:17.7968	\N
6383	545	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.799061	2026-02-24 14:54:17.799061	\N
6384	545	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.800816	2026-02-24 14:54:17.800816	\N
6385	546	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.803942	2026-02-24 14:54:17.803942	\N
6386	546	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.805733	2026-02-24 14:54:17.805733	\N
6387	546	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.807726	2026-02-24 14:54:17.807726	\N
6388	546	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.809582	2026-02-24 14:54:17.809582	\N
6389	546	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.811306	2026-02-24 14:54:17.811306	\N
6390	546	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.814255	2026-02-24 14:54:17.814255	\N
6391	546	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.816402	2026-02-24 14:54:17.816402	\N
6392	546	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.818226	2026-02-24 14:54:17.818226	\N
6393	546	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.820236	2026-02-24 14:54:17.820236	\N
6394	546	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.82202	2026-02-24 14:54:17.82202	\N
6395	547	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.825368	2026-02-24 14:54:17.825368	\N
6396	547	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.827171	2026-02-24 14:54:17.827171	\N
6397	547	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.830148	2026-02-24 14:54:17.830148	\N
6398	547	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.832272	2026-02-24 14:54:17.832272	\N
6399	547	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.834235	2026-02-24 14:54:17.834235	\N
6400	547	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.836124	2026-02-24 14:54:17.836124	\N
6401	547	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.837902	2026-02-24 14:54:17.837902	\N
6402	547	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.839812	2026-02-24 14:54:17.839812	\N
6403	547	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.841805	2026-02-24 14:54:17.841805	\N
6404	547	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.843712	2026-02-24 14:54:17.843712	\N
6405	548	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.848096	2026-02-24 14:54:17.848096	\N
6406	548	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.850091	2026-02-24 14:54:17.850091	\N
6407	548	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.851821	2026-02-24 14:54:17.851821	\N
6408	548	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.85361	2026-02-24 14:54:17.85361	\N
6409	548	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.855343	2026-02-24 14:54:17.855343	\N
6410	548	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.857286	2026-02-24 14:54:17.857286	\N
6411	548	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.859226	2026-02-24 14:54:17.859226	\N
6412	548	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.861349	2026-02-24 14:54:17.861349	\N
6413	548	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.864875	2026-02-24 14:54:17.864875	\N
6414	548	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.867202	2026-02-24 14:54:17.867202	\N
6415	549	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.870727	2026-02-24 14:54:17.870727	\N
6416	549	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.873138	2026-02-24 14:54:17.873138	\N
6417	549	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.875513	2026-02-24 14:54:17.875513	\N
6418	549	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.877583	2026-02-24 14:54:17.877583	\N
6419	549	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.881522	2026-02-24 14:54:17.881522	\N
6420	549	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.884187	2026-02-24 14:54:17.884187	\N
6421	549	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.886386	2026-02-24 14:54:17.886386	\N
6422	549	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.888592	2026-02-24 14:54:17.888592	\N
6423	549	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.890956	2026-02-24 14:54:17.890956	\N
6424	549	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.892985	2026-02-24 14:54:17.892985	\N
6425	550	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.897757	2026-02-24 14:54:17.897757	\N
6426	550	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.901064	2026-02-24 14:54:17.901064	\N
6427	550	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.902902	2026-02-24 14:54:17.902902	\N
6428	550	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.904637	2026-02-24 14:54:17.904637	\N
6429	550	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.906575	2026-02-24 14:54:17.906575	\N
6430	550	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.90839	2026-02-24 14:54:17.90839	\N
6431	550	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.910161	2026-02-24 14:54:17.910161	\N
6432	550	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.912616	2026-02-24 14:54:17.912616	\N
6433	550	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.91551	2026-02-24 14:54:17.91551	\N
6434	550	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.917455	2026-02-24 14:54:17.917455	\N
6435	551	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.921122	2026-02-24 14:54:17.921122	\N
6436	551	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.922909	2026-02-24 14:54:17.922909	\N
6437	551	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.924682	2026-02-24 14:54:17.924682	\N
6438	551	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.926774	2026-02-24 14:54:17.926774	\N
6439	551	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.929133	2026-02-24 14:54:17.929133	\N
6440	551	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.931595	2026-02-24 14:54:17.931595	\N
6441	551	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.933454	2026-02-24 14:54:17.933454	\N
6442	551	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.935173	2026-02-24 14:54:17.935173	\N
6443	551	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.937122	2026-02-24 14:54:17.937122	\N
6444	551	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.938934	2026-02-24 14:54:17.938934	\N
6445	552	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.945411	2026-02-24 14:54:17.945411	\N
6446	552	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.948513	2026-02-24 14:54:17.948513	\N
6447	552	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.950407	2026-02-24 14:54:17.950407	\N
6448	552	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.952139	2026-02-24 14:54:17.952139	\N
6449	552	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.95397	2026-02-24 14:54:17.95397	\N
6450	552	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.95582	2026-02-24 14:54:17.95582	\N
6451	552	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.95766	2026-02-24 14:54:17.95766	\N
6452	552	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.959514	2026-02-24 14:54:17.959514	\N
6453	552	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.961224	2026-02-24 14:54:17.961224	\N
6454	552	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.964159	2026-02-24 14:54:17.964159	\N
6455	553	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.967929	2026-02-24 14:54:17.967929	\N
6456	553	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:17.969853	2026-02-24 14:54:17.969853	\N
6457	553	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:17.971554	2026-02-24 14:54:17.971554	\N
6458	553	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:17.97328	2026-02-24 14:54:17.97328	\N
6459	553	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:17.975081	2026-02-24 14:54:17.975081	\N
6460	553	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:17.976853	2026-02-24 14:54:17.976853	\N
6461	553	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:17.979447	2026-02-24 14:54:17.979447	\N
6462	553	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:17.981883	2026-02-24 14:54:17.981883	\N
6463	553	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:17.983879	2026-02-24 14:54:17.983879	\N
6464	553	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:17.992783	2026-02-24 14:54:17.992783	\N
6465	554	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:17.999486	2026-02-24 14:54:17.999486	\N
6466	554	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.001279	2026-02-24 14:54:18.001279	\N
6467	554	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.00312	2026-02-24 14:54:18.00312	\N
6468	554	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.004852	2026-02-24 14:54:18.004852	\N
6469	554	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.006541	2026-02-24 14:54:18.006541	\N
6470	554	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.008394	2026-02-24 14:54:18.008394	\N
6471	554	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.010102	2026-02-24 14:54:18.010102	\N
6472	554	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.012173	2026-02-24 14:54:18.012173	\N
6473	554	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.015136	2026-02-24 14:54:18.015136	\N
6474	554	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.017078	2026-02-24 14:54:18.017078	\N
6475	555	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.020255	2026-02-24 14:54:18.020255	\N
6476	555	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.02199	2026-02-24 14:54:18.02199	\N
6477	555	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.023873	2026-02-24 14:54:18.023873	\N
6478	555	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.02556	2026-02-24 14:54:18.02556	\N
6479	555	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.027331	2026-02-24 14:54:18.027331	\N
6480	555	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.03075	2026-02-24 14:54:18.03075	\N
6481	555	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.033514	2026-02-24 14:54:18.033514	\N
6482	555	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.035723	2026-02-24 14:54:18.035723	\N
6483	555	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.037866	2026-02-24 14:54:18.037866	\N
6484	555	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.03976	2026-02-24 14:54:18.03976	\N
6485	556	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.042988	2026-02-24 14:54:18.042988	\N
6486	556	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.044763	2026-02-24 14:54:18.044763	\N
6487	556	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.047816	2026-02-24 14:54:18.047816	\N
6488	556	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.049702	2026-02-24 14:54:18.049702	\N
6489	556	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.051407	2026-02-24 14:54:18.051407	\N
6490	556	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.05329	2026-02-24 14:54:18.05329	\N
6491	556	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.055096	2026-02-24 14:54:18.055096	\N
6492	556	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.056905	2026-02-24 14:54:18.056905	\N
6493	556	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.058853	2026-02-24 14:54:18.058853	\N
6494	556	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.060675	2026-02-24 14:54:18.060675	\N
6495	557	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.0661	2026-02-24 14:54:18.0661	\N
6496	557	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.069704	2026-02-24 14:54:18.069704	\N
6497	557	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.07559	2026-02-24 14:54:18.07559	\N
6498	557	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.078011	2026-02-24 14:54:18.078011	\N
6499	557	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.081577	2026-02-24 14:54:18.081577	\N
6500	557	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.083682	2026-02-24 14:54:18.083682	\N
6501	557	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.085912	2026-02-24 14:54:18.085912	\N
6502	557	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.087835	2026-02-24 14:54:18.087835	\N
6503	557	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.089722	2026-02-24 14:54:18.089722	\N
6504	557	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.091819	2026-02-24 14:54:18.091819	\N
6505	558	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.096647	2026-02-24 14:54:18.096647	\N
6506	558	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.09887	2026-02-24 14:54:18.09887	\N
6507	558	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.100734	2026-02-24 14:54:18.100734	\N
6508	558	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.102481	2026-02-24 14:54:18.102481	\N
6509	558	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.104161	2026-02-24 14:54:18.104161	\N
6510	558	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.106037	2026-02-24 14:54:18.106037	\N
6511	558	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.10801	2026-02-24 14:54:18.10801	\N
6512	558	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.109732	2026-02-24 14:54:18.109732	\N
6513	558	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.111682	2026-02-24 14:54:18.111682	\N
6514	558	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.114458	2026-02-24 14:54:18.114458	\N
6515	559	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.117924	2026-02-24 14:54:18.117924	\N
6516	559	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.11973	2026-02-24 14:54:18.11973	\N
6517	559	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.121504	2026-02-24 14:54:18.121504	\N
6518	559	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.123434	2026-02-24 14:54:18.123434	\N
6519	559	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.125197	2026-02-24 14:54:18.125197	\N
6520	559	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.127122	2026-02-24 14:54:18.127122	\N
6521	559	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.129788	2026-02-24 14:54:18.129788	\N
6522	559	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.132083	2026-02-24 14:54:18.132083	\N
6523	559	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.13393	2026-02-24 14:54:18.13393	\N
6524	559	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.135652	2026-02-24 14:54:18.135652	\N
6525	560	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.138757	2026-02-24 14:54:18.138757	\N
6526	560	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.140455	2026-02-24 14:54:18.140455	\N
6527	560	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.142288	2026-02-24 14:54:18.142288	\N
6528	560	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.144033	2026-02-24 14:54:18.144033	\N
6529	560	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.146659	2026-02-24 14:54:18.146659	\N
6530	560	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.148954	2026-02-24 14:54:18.148954	\N
6531	560	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.150957	2026-02-24 14:54:18.150957	\N
6532	560	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.152869	2026-02-24 14:54:18.152869	\N
6533	560	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.154663	2026-02-24 14:54:18.154663	\N
6534	560	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.156506	2026-02-24 14:54:18.156506	\N
6535	561	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.159646	2026-02-24 14:54:18.159646	\N
6536	561	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.16135	2026-02-24 14:54:18.16135	\N
6537	561	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.164318	2026-02-24 14:54:18.164318	\N
6538	561	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.16646	2026-02-24 14:54:18.16646	\N
6539	561	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.16847	2026-02-24 14:54:18.16847	\N
6540	561	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.170354	2026-02-24 14:54:18.170354	\N
6541	561	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.172062	2026-02-24 14:54:18.172062	\N
6542	561	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.173853	2026-02-24 14:54:18.173853	\N
6543	561	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.175724	2026-02-24 14:54:18.175724	\N
6544	561	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.177523	2026-02-24 14:54:18.177523	\N
6545	562	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.181778	2026-02-24 14:54:18.181778	\N
6546	562	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.184078	2026-02-24 14:54:18.184078	\N
6547	562	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.187517	2026-02-24 14:54:18.187517	\N
6548	562	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.189429	2026-02-24 14:54:18.189429	\N
6549	562	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.196927	2026-02-24 14:54:18.196927	\N
6550	562	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.199041	2026-02-24 14:54:18.199041	\N
6551	562	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.200941	2026-02-24 14:54:18.200941	\N
6552	562	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.202815	2026-02-24 14:54:18.202815	\N
6553	562	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.206254	2026-02-24 14:54:18.206254	\N
6554	562	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.208134	2026-02-24 14:54:18.208134	\N
6555	563	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.211258	2026-02-24 14:54:18.211258	\N
6556	563	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.214287	2026-02-24 14:54:18.214287	\N
6557	563	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.216552	2026-02-24 14:54:18.216552	\N
6558	563	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.218423	2026-02-24 14:54:18.218423	\N
6559	563	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.220278	2026-02-24 14:54:18.220278	\N
6560	563	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.222073	2026-02-24 14:54:18.222073	\N
6561	563	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.223756	2026-02-24 14:54:18.223756	\N
6562	563	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.225655	2026-02-24 14:54:18.225655	\N
6563	563	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.227425	2026-02-24 14:54:18.227425	\N
6564	563	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.230446	2026-02-24 14:54:18.230446	\N
6565	564	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.23372	2026-02-24 14:54:18.23372	\N
6566	564	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.235695	2026-02-24 14:54:18.235695	\N
6567	564	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.237513	2026-02-24 14:54:18.237513	\N
6568	564	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.239245	2026-02-24 14:54:18.239245	\N
6569	564	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.241072	2026-02-24 14:54:18.241072	\N
6570	564	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.242838	2026-02-24 14:54:18.242838	\N
6571	564	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.244506	2026-02-24 14:54:18.244506	\N
6572	564	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.247845	2026-02-24 14:54:18.247845	\N
6573	564	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.249719	2026-02-24 14:54:18.249719	\N
6574	564	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.251622	2026-02-24 14:54:18.251622	\N
6575	565	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.254668	2026-02-24 14:54:18.254668	\N
6576	565	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.256543	2026-02-24 14:54:18.256543	\N
6577	565	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.258318	2026-02-24 14:54:18.258318	\N
6578	565	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.259995	2026-02-24 14:54:18.259995	\N
6579	565	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.26292	2026-02-24 14:54:18.26292	\N
6580	565	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.265566	2026-02-24 14:54:18.265566	\N
6581	565	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.267866	2026-02-24 14:54:18.267866	\N
6582	565	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.26996	2026-02-24 14:54:18.26996	\N
6583	565	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.275319	2026-02-24 14:54:18.275319	\N
6584	565	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.277685	2026-02-24 14:54:18.277685	\N
6585	566	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.283727	2026-02-24 14:54:18.283727	\N
6586	566	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.316968	2026-02-24 14:54:18.316968	\N
6587	566	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.405513	2026-02-24 14:54:18.405513	\N
6588	566	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.407902	2026-02-24 14:54:18.407902	\N
6589	566	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.410674	2026-02-24 14:54:18.410674	\N
6590	566	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.414841	2026-02-24 14:54:18.414841	\N
6591	566	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.418621	2026-02-24 14:54:18.418621	\N
6592	566	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.421335	2026-02-24 14:54:18.421335	\N
6593	566	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.423563	2026-02-24 14:54:18.423563	\N
6594	566	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.425824	2026-02-24 14:54:18.425824	\N
6595	567	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.430935	2026-02-24 14:54:18.430935	\N
6596	567	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.434199	2026-02-24 14:54:18.434199	\N
6597	567	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.436516	2026-02-24 14:54:18.436516	\N
6598	567	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.449775	2026-02-24 14:54:18.449775	\N
6599	567	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.46254	2026-02-24 14:54:18.46254	\N
6600	567	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.46927	2026-02-24 14:54:18.46927	\N
6601	567	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.475825	2026-02-24 14:54:18.475825	\N
6602	567	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.477989	2026-02-24 14:54:18.477989	\N
6603	567	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.483395	2026-02-24 14:54:18.483395	\N
6604	567	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.485687	2026-02-24 14:54:18.485687	\N
6605	568	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.489157	2026-02-24 14:54:18.489157	\N
6606	568	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.491109	2026-02-24 14:54:18.491109	\N
6607	568	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.493087	2026-02-24 14:54:18.493087	\N
6608	568	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.496075	2026-02-24 14:54:18.496075	\N
6609	568	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.498775	2026-02-24 14:54:18.498775	\N
6610	568	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.50093	2026-02-24 14:54:18.50093	\N
6611	568	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.502676	2026-02-24 14:54:18.502676	\N
6612	568	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.504544	2026-02-24 14:54:18.504544	\N
6613	568	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.506258	2026-02-24 14:54:18.506258	\N
6614	568	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.508391	2026-02-24 14:54:18.508391	\N
6615	569	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.511407	2026-02-24 14:54:18.511407	\N
6616	569	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.514365	2026-02-24 14:54:18.514365	\N
6617	569	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.51641	2026-02-24 14:54:18.51641	\N
6618	569	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.518351	2026-02-24 14:54:18.518351	\N
6619	569	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.520217	2026-02-24 14:54:18.520217	\N
6620	569	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.521912	2026-02-24 14:54:18.521912	\N
6621	569	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.52385	2026-02-24 14:54:18.52385	\N
6622	569	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.525595	2026-02-24 14:54:18.525595	\N
6623	569	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.527299	2026-02-24 14:54:18.527299	\N
6624	569	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.530243	2026-02-24 14:54:18.530243	\N
6625	570	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.533659	2026-02-24 14:54:18.533659	\N
6626	570	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.535512	2026-02-24 14:54:18.535512	\N
6627	570	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.537223	2026-02-24 14:54:18.537223	\N
6628	570	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.540554	2026-02-24 14:54:18.540554	\N
6629	570	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.543947	2026-02-24 14:54:18.543947	\N
6630	570	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.547711	2026-02-24 14:54:18.547711	\N
6631	570	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.549794	2026-02-24 14:54:18.549794	\N
6632	570	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.551624	2026-02-24 14:54:18.551624	\N
6633	570	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.553753	2026-02-24 14:54:18.553753	\N
6634	570	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.555759	2026-02-24 14:54:18.555759	\N
6635	571	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.559182	2026-02-24 14:54:18.559182	\N
6636	571	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.560946	2026-02-24 14:54:18.560946	\N
6637	571	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.563912	2026-02-24 14:54:18.563912	\N
6638	571	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.566074	2026-02-24 14:54:18.566074	\N
6639	571	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.56783	2026-02-24 14:54:18.56783	\N
6640	571	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.569744	2026-02-24 14:54:18.569744	\N
6641	571	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.571493	2026-02-24 14:54:18.571493	\N
6642	571	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.573276	2026-02-24 14:54:18.573276	\N
6643	571	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.575191	2026-02-24 14:54:18.575191	\N
6644	571	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.57713	2026-02-24 14:54:18.57713	\N
6645	576	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.58174	2026-02-24 14:54:18.58174	\N
6646	576	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.583907	2026-02-24 14:54:18.583907	\N
6647	576	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.586055	2026-02-24 14:54:18.586055	\N
6648	576	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.588113	2026-02-24 14:54:18.588113	\N
6649	576	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.590071	2026-02-24 14:54:18.590071	\N
6650	576	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.591759	2026-02-24 14:54:18.591759	\N
6651	576	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.593588	2026-02-24 14:54:18.593588	\N
6652	576	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.596158	2026-02-24 14:54:18.596158	\N
6653	576	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.598518	2026-02-24 14:54:18.598518	\N
6654	576	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.600349	2026-02-24 14:54:18.600349	\N
6655	577	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.603331	2026-02-24 14:54:18.603331	\N
6656	577	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.605236	2026-02-24 14:54:18.605236	\N
6657	577	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.606942	2026-02-24 14:54:18.606942	\N
6658	577	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.608855	2026-02-24 14:54:18.608855	\N
6659	577	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.610608	2026-02-24 14:54:18.610608	\N
6660	577	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.613181	2026-02-24 14:54:18.613181	\N
6661	577	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.615441	2026-02-24 14:54:18.615441	\N
6662	577	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.617461	2026-02-24 14:54:18.617461	\N
6663	577	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.619411	2026-02-24 14:54:18.619411	\N
6664	577	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.621192	2026-02-24 14:54:18.621192	\N
6665	578	31	3	2025	4000.00	4000.00	pending	0.00	2025-04-01	2026-02-24 14:54:18.624298	2026-02-24 14:54:18.624298	\N
6666	578	31	4	2025	4000.00	4000.00	pending	0.00	2025-05-01	2026-02-24 14:54:18.626088	2026-02-24 14:54:18.626088	\N
6667	578	31	5	2025	4000.00	4000.00	pending	0.00	2025-06-01	2026-02-24 14:54:18.62793	2026-02-24 14:54:18.62793	\N
6668	578	31	6	2025	4000.00	4000.00	pending	0.00	2025-07-01	2026-02-24 14:54:18.630745	2026-02-24 14:54:18.630745	\N
6669	578	31	7	2025	4000.00	4000.00	pending	0.00	2025-08-01	2026-02-24 14:54:18.632862	2026-02-24 14:54:18.632862	\N
6670	578	31	8	2025	4000.00	4000.00	pending	0.00	2025-09-01	2026-02-24 14:54:18.634817	2026-02-24 14:54:18.634817	\N
6671	578	31	9	2025	4000.00	4000.00	pending	0.00	2025-10-01	2026-02-24 14:54:18.636659	2026-02-24 14:54:18.636659	\N
6672	578	31	10	2025	4000.00	4000.00	pending	0.00	2025-11-01	2026-02-24 14:54:18.638549	2026-02-24 14:54:18.638549	\N
6673	578	31	11	2025	4000.00	4000.00	pending	0.00	2025-12-01	2026-02-24 14:54:18.64031	2026-02-24 14:54:18.64031	\N
6674	578	31	12	2025	4000.00	4000.00	pending	0.00	2026-01-01	2026-02-24 14:54:18.641973	2026-02-24 14:54:18.641973	\N
5475	307	31	3	2025	4000.00	4000.00	pending	0.00	2025-03-30	2026-02-24 14:54:15.604977	2026-02-24 15:49:41.650821	\N
6675	307	31	2	2025	4000.00	4000.00	pending	0.00	\N	2026-02-24 14:55:34.403461	2026-02-24 15:49:55.531503	\N
\.


--
-- Data for Name: maintenance_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.maintenance_config (id, society_apartment_id, base_amount, created_at, updated_at, block_id, unit_id) FROM stdin;
5	31	4000.00	2026-02-23 16:47:46.434521	2026-02-23 16:47:46.434521	\N	\N
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.messages (id, sender_id, receiver_id, body, read_at, created_at) FROM stdin;
\.


--
-- Data for Name: monthly_dues_generation_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.monthly_dues_generation_log (id, generation_date, month, year, total_units, successful_generations, failed_generations, errors, created_at) FROM stdin;
\.


--
-- Data for Name: payment_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment_history (id, maintenance_id, updated_by, previous_status, new_status, previous_amount_paid, new_amount_paid, amount_change, notes, created_at) FROM stdin;
\.


--
-- Data for Name: push_subscriptions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.push_subscriptions (id, user_id, endpoint, p256dh, auth, created_at) FROM stdin;
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.settings (id, society_apartment_id, defaulter_list_visible, complaint_logs_visible, financial_reports_visible, created_at, updated_at, email_dues_on_generate, email_reminder_days_before) FROM stdin;
\.


--
-- Data for Name: subscription_plans; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subscription_plans (id, name, amount, interval_months, is_active, created_at, updated_at) FROM stdin;
1	Monthly	4000.00	1	t	2026-02-10 14:12:56.489501	2026-02-23 12:40:31.81576
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subscriptions (id, user_id, society_apartment_id, plan_id, status, start_date, end_date, next_billing_date, created_at, updated_at) FROM stdin;
23	49	31	1	active	2026-02-23	\N	2026-03-23	2026-02-23 12:52:19.619675	2026-02-23 16:35:07.704938
\.


--
-- Data for Name: super_admin_invoices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.super_admin_invoices (id, user_id, society_apartment_id, subscription_id, amount, currency, status, due_date, period_start, period_end, notes, created_at, updated_at, payment_proof_path, payment_proof_uploaded_at) FROM stdin;
4	49	31	23	4000.00	PKR	sent	2026-03-29	2026-02-23	2026-03-22	\N	2026-02-23 13:11:29.180358	2026-02-23 13:11:29.180358	\N	\N
\.


--
-- Data for Name: union_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.union_members (id, member_name, designation, phone, email, joining_date, unit_id, society_apartment_id, created_by, created_at, updated_at) FROM stdin;
1	Shahid Hussain	President	(301) 145-7030	hasanshkh17@gmail.com	2025-01-01	533	31	49	2026-02-24 16:47:24.523279	2026-02-24 16:47:24.523279
\.


--
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.units (id, society_apartment_id, block_id, floor_id, unit_number, owner_name, resident_name, contact_number, email, k_electric_account, gas_account, water_account, phone_tv_account, car_make_model, license_plate, number_of_cars, created_at, updated_at, telephone_bills, other_bills, is_occupied) FROM stdin;
579	31	65	82	E-805	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:26:11.505963	2026-02-23 16:26:11.505963	{}	{}	f
315	31	64	67	B-103	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.216351	2026-02-23 15:45:55.216351	[]	[]	f
316	31	64	67	A-104	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.225139	2026-02-23 15:45:55.225139	[]	[]	f
317	31	64	67	A-105	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.234132	2026-02-23 15:45:55.234132	[]	[]	f
318	31	64	67	C-106	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.23955	2026-02-23 15:45:55.23955	[]	[]	f
319	31	64	67	C-107	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.244561	2026-02-23 15:45:55.244561	[]	[]	f
320	31	64	67	C-108	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.248106	2026-02-23 15:45:55.248106	[]	[]	f
321	31	64	67	C-109	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.254452	2026-02-23 15:45:55.254452	[]	[]	f
322	31	64	67	C-110	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.259831	2026-02-23 15:45:55.259831	[]	[]	f
323	31	64	67	C-111	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.267748	2026-02-23 15:45:55.267748	[]	[]	f
311	31	64	66	A-005	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.194707	2026-02-24 12:10:57.72899	[]	[]	f
325	31	64	68	A-201	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.278328	2026-02-23 15:45:55.278328	[]	[]	f
326	31	64	68	A-202	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.281901	2026-02-23 15:45:55.281901	[]	[]	f
327	31	64	68	B-203	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.287229	2026-02-23 15:45:55.287229	[]	[]	f
328	31	64	68	A-204	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.292576	2026-02-23 15:45:55.292576	[]	[]	f
329	31	64	68	A-205	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.296838	2026-02-23 15:45:55.296838	[]	[]	f
330	31	64	68	C-206	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.304725	2026-02-23 15:45:55.304725	[]	[]	f
331	31	64	68	C-207	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.31144	2026-02-23 15:45:55.31144	[]	[]	f
332	31	64	68	C-208	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.317895	2026-02-23 15:45:55.317895	[]	[]	f
333	31	64	68	C-209	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.325644	2026-02-23 15:45:55.325644	[]	[]	f
334	31	64	68	D-210	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.329755	2026-02-23 15:45:55.329755	[]	[]	f
335	31	64	68	A1-209	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.334787	2026-02-23 15:45:55.334787	[]	[]	f
310	31	64	66	A-004	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.190518	2026-02-24 12:11:13.756936	[]	[]	f
337	31	64	69	A-301	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.34555	2026-02-23 15:45:55.34555	[]	[]	f
338	31	64	69	A-302	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.349604	2026-02-23 15:45:55.349604	[]	[]	f
339	31	64	69	B-303	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.353489	2026-02-23 15:45:55.353489	[]	[]	f
340	31	64	69	A-304	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.356745	2026-02-23 15:45:55.356745	[]	[]	f
341	31	64	69	A-305	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.360508	2026-02-23 15:45:55.360508	[]	[]	f
342	31	64	69	C-306	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.364048	2026-02-23 15:45:55.364048	[]	[]	f
343	31	64	69	C-307	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.368049	2026-02-23 15:45:55.368049	[]	[]	f
344	31	64	69	C-308	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.371549	2026-02-23 15:45:55.371549	[]	[]	f
345	31	64	69	C-309	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.374668	2026-02-23 15:45:55.374668	[]	[]	f
346	31	64	69	D-310	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.377661	2026-02-23 15:45:55.377661	[]	[]	f
347	31	64	69	A1-309	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.381127	2026-02-23 15:45:55.381127	[]	[]	f
309	31	64	66	A-003	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.186224	2026-02-24 12:11:26.62416	[]	[]	f
349	31	64	70	A-401	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.387772	2026-02-23 15:45:55.387772	[]	[]	f
350	31	64	70	A-402	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.391066	2026-02-23 15:45:55.391066	[]	[]	f
351	31	64	70	B-403	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.394381	2026-02-23 15:45:55.394381	[]	[]	f
352	31	64	70	A-404	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.397483	2026-02-23 15:45:55.397483	[]	[]	f
353	31	64	70	A-405	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.401242	2026-02-23 15:45:55.401242	[]	[]	f
354	31	64	70	E-406	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.404464	2026-02-23 15:45:55.404464	[]	[]	f
355	31	64	70	E-407	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.407416	2026-02-23 15:45:55.407416	[]	[]	f
356	31	64	70	E-408	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.410508	2026-02-23 15:45:55.410508	[]	[]	f
357	31	64	70	E-409	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.413417	2026-02-23 15:45:55.413417	[]	[]	f
358	31	64	70	E-410	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.417368	2026-02-23 15:45:55.417368	[]	[]	f
359	31	64	70	E-411	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.420596	2026-02-23 15:45:55.420596	[]	[]	f
308	31	64	66	A-002	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.179678	2026-02-24 12:11:43.0494	[]	[]	f
361	31	64	71	A-501	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.426669	2026-02-23 15:45:55.426669	[]	[]	f
362	31	64	71	A-502	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.430051	2026-02-23 15:45:55.430051	[]	[]	f
363	31	64	71	B-503	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.434172	2026-02-23 15:45:55.434172	[]	[]	f
364	31	64	71	A-504	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.437399	2026-02-23 15:45:55.437399	[]	[]	f
365	31	64	71	A-505	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.440838	2026-02-23 15:45:55.440838	[]	[]	f
366	31	64	71	E-506	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.444148	2026-02-23 15:45:55.444148	[]	[]	f
367	31	64	71	E-507	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.447255	2026-02-23 15:45:55.447255	[]	[]	f
368	31	64	71	E-508	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.451255	2026-02-23 15:45:55.451255	[]	[]	f
369	31	64	71	E-509	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.454469	2026-02-23 15:45:55.454469	[]	[]	f
370	31	64	71	E-510	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.457497	2026-02-23 15:45:55.457497	[]	[]	f
371	31	64	71	E-511	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.460624	2026-02-23 15:45:55.460624	[]	[]	f
307	31	64	66	A-001	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.164748	2026-02-24 12:12:09.60251	[]	[]	f
373	31	64	72	A-601	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.467337	2026-02-23 15:45:55.467337	[]	[]	f
374	31	64	72	A-602	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.470702	2026-02-23 15:45:55.470702	[]	[]	f
375	31	64	72	B-603	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.473816	2026-02-23 15:45:55.473816	[]	[]	f
376	31	64	72	A-604	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.476921	2026-02-23 15:45:55.476921	[]	[]	f
377	31	64	72	A-605	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.48041	2026-02-23 15:45:55.48041	[]	[]	f
378	31	64	72	E-606	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.48496	2026-02-23 15:45:55.48496	[]	[]	f
379	31	64	72	E-607	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.488529	2026-02-23 15:45:55.488529	[]	[]	f
380	31	64	72	E-608	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.491951	2026-02-23 15:45:55.491951	[]	[]	f
381	31	64	72	E-609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.495242	2026-02-23 15:45:55.495242	[]	[]	f
382	31	64	72	E-610	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.498344	2026-02-23 15:45:55.498344	[]	[]	f
383	31	64	72	E-611	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.502425	2026-02-23 15:45:55.502425	[]	[]	f
313	31	64	67	A-101	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.206393	2026-02-24 14:35:40.874534	[]	[]	f
385	31	64	73	A-701	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.510765	2026-02-23 15:45:55.510765	[]	[]	f
386	31	64	73	A-702	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.514142	2026-02-23 15:45:55.514142	[]	[]	f
387	31	64	73	B-703	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.520549	2026-02-23 15:45:55.520549	[]	[]	f
314	31	64	67	A-102	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.210539	2026-02-24 14:35:57.93487	[]	[]	f
388	31	64	73	A-704	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.525132	2026-02-23 15:45:55.525132	[]	[]	f
389	31	64	73	A-705	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.529436	2026-02-23 15:45:55.529436	[]	[]	f
390	31	64	73	E-706	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.533939	2026-02-23 15:45:55.533939	[]	[]	f
391	31	64	73	E-707	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.537529	2026-02-23 15:45:55.537529	[]	[]	f
392	31	64	73	E-708	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.540742	2026-02-23 15:45:55.540742	[]	[]	f
393	31	64	73	E-709	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.543986	2026-02-23 15:45:55.543986	[]	[]	f
394	31	64	73	E-710	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.547426	2026-02-23 15:45:55.547426	[]	[]	f
395	31	64	73	E-711	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.55088	2026-02-23 15:45:55.55088	[]	[]	f
397	31	64	74	A-801	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.557075	2026-02-23 15:45:55.557075	[]	[]	f
398	31	64	74	A-802	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.560203	2026-02-23 15:45:55.560203	[]	[]	f
399	31	64	74	B-803	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.563369	2026-02-23 15:45:55.563369	[]	[]	f
400	31	64	74	A-804	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.56731	2026-02-23 15:45:55.56731	[]	[]	f
401	31	64	74	A-805	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.571478	2026-02-23 15:45:55.571478	[]	[]	f
402	31	64	74	E-806	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.574824	2026-02-23 15:45:55.574824	[]	[]	f
403	31	64	74	E-807	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.578385	2026-02-23 15:45:55.578385	[]	[]	f
404	31	64	74	E-808	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.582439	2026-02-23 15:45:55.582439	[]	[]	f
405	31	64	74	E-809	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.586203	2026-02-23 15:45:55.586203	[]	[]	f
406	31	64	74	E-810	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.589335	2026-02-23 15:45:55.589335	[]	[]	f
407	31	64	74	E-811	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.593497	2026-02-23 15:45:55.593497	[]	[]	f
491	31	65	75	A-101	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.353212	2026-02-23 16:04:31.353212	[]	[]	f
492	31	65	75	A-102	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.386193	2026-02-23 16:04:31.386193	[]	[]	f
493	31	65	75	B-103	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.389523	2026-02-23 16:04:31.389523	[]	[]	f
494	31	65	75	A-104	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.392455	2026-02-23 16:04:31.392455	[]	[]	f
495	31	65	75	C-109	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.395463	2026-02-23 16:04:31.395463	[]	[]	f
496	31	65	75	C-106	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.400484	2026-02-23 16:04:31.400484	[]	[]	f
497	31	65	75	C-107	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.405516	2026-02-23 16:04:31.405516	[]	[]	f
498	31	65	75	C-108	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.409287	2026-02-23 16:04:31.409287	[]	[]	f
499	31	65	75	A2-109	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.412715	2026-02-23 16:04:31.412715	[]	[]	f
500	31	65	75	A1-105	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.417479	2026-02-23 16:04:31.417479	[]	[]	f
501	31	65	76	A-201	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.421356	2026-02-23 16:04:31.421356	[]	[]	f
502	31	65	76	A-202	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.424227	2026-02-23 16:04:31.424227	[]	[]	f
503	31	65	76	B-203	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.42723	2026-02-23 16:04:31.42723	[]	[]	f
504	31	65	76	A-204	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.430089	2026-02-23 16:04:31.430089	[]	[]	f
505	31	65	76	A-209	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.435269	2026-02-23 16:04:31.435269	[]	[]	f
506	31	65	76	C-206	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.438865	2026-02-23 16:04:31.438865	[]	[]	f
507	31	65	76	C-207	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.441809	2026-02-23 16:04:31.441809	[]	[]	f
508	31	65	76	C-208	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.444689	2026-02-23 16:04:31.444689	[]	[]	f
509	31	65	76	A2-209	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.44836	2026-02-23 16:04:31.44836	[]	[]	f
510	31	65	76	A1-205	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.452802	2026-02-23 16:04:31.452802	[]	[]	f
511	31	65	77	A-301	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.455748	2026-02-23 16:04:31.455748	[]	[]	f
512	31	65	77	A-302	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.458647	2026-02-23 16:04:31.458647	[]	[]	f
513	31	65	77	B-303	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.461533	2026-02-23 16:04:31.461533	[]	[]	f
514	31	65	77	A-304	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.464891	2026-02-23 16:04:31.464891	[]	[]	f
515	31	65	77	A-309	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.470024	2026-02-23 16:04:31.470024	[]	[]	f
516	31	65	77	C-306	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.473188	2026-02-23 16:04:31.473188	[]	[]	f
517	31	65	77	C-307	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.476069	2026-02-23 16:04:31.476069	[]	[]	f
518	31	65	77	D-309	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.485299	2026-02-23 16:04:31.485299	[]	[]	f
519	31	65	77	C-310	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.48909	2026-02-23 16:04:31.48909	[]	[]	f
520	31	65	77	A1-305	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.491946	2026-02-23 16:04:31.491946	[]	[]	f
521	31	65	78	A-401	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.495324	2026-02-23 16:04:31.495324	[]	[]	f
522	31	65	78	A-402	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.499606	2026-02-23 16:04:31.499606	[]	[]	f
523	31	65	78	B-403	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.50451	2026-02-23 16:04:31.50451	[]	[]	f
524	31	65	78	A-404	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.508193	2026-02-23 16:04:31.508193	[]	[]	f
525	31	65	78	A-409	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.511785	2026-02-23 16:04:31.511785	[]	[]	f
526	31	65	78	C-406	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.516204	2026-02-23 16:04:31.516204	[]	[]	f
527	31	65	78	C-407	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.519993	2026-02-23 16:04:31.519993	[]	[]	f
528	31	65	78	C-408	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.522918	2026-02-23 16:04:31.522918	[]	[]	f
529	31	65	78	A2-409	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.526267	2026-02-23 16:04:31.526267	[]	[]	f
530	31	65	78	A1-405	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.529173	2026-02-23 16:04:31.529173	[]	[]	f
531	31	65	79	A-501	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.533403	2026-02-23 16:04:31.533403	[]	[]	f
532	31	65	79	A-502	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.536833	2026-02-23 16:04:31.536833	[]	[]	f
533	31	65	79	B-503	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.540663	2026-02-23 16:04:31.540663	[]	[]	f
534	31	65	79	A-504	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.544811	2026-02-23 16:04:31.544811	[]	[]	f
535	31	65	79	A-509	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.54946	2026-02-23 16:04:31.54946	[]	[]	f
536	31	65	79	E-506	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.55471	2026-02-23 16:04:31.55471	[]	[]	f
537	31	65	79	E-507	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.558129	2026-02-23 16:04:31.558129	[]	[]	f
538	31	65	79	E-508	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.561687	2026-02-23 16:04:31.561687	[]	[]	f
539	31	65	79	E-509	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.566053	2026-02-23 16:04:31.566053	[]	[]	f
540	31	65	79	E-510	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.570457	2026-02-23 16:04:31.570457	[]	[]	f
541	31	65	79	E-505	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.573637	2026-02-23 16:04:31.573637	[]	[]	f
542	31	65	80	A-601	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.57668	2026-02-23 16:04:31.57668	[]	[]	f
543	31	65	80	A-602	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.57989	2026-02-23 16:04:31.57989	[]	[]	f
544	31	65	80	B-603	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.58438	2026-02-23 16:04:31.58438	[]	[]	f
545	31	65	80	A-604	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.58775	2026-02-23 16:04:31.58775	[]	[]	f
546	31	65	80	A-609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.591701	2026-02-23 16:04:31.591701	[]	[]	f
547	31	65	80	E-606	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.594909	2026-02-23 16:04:31.594909	[]	[]	f
548	31	65	80	E-607	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.598734	2026-02-23 16:04:31.598734	[]	[]	f
549	31	65	80	E-608	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.602434	2026-02-23 16:04:31.602434	[]	[]	f
550	31	65	80	E-609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.60516	2026-02-23 16:04:31.60516	[]	[]	f
551	31	65	80	E-610	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.608085	2026-02-23 16:04:31.608085	[]	[]	f
552	31	65	80	E-605	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.611183	2026-02-23 16:04:31.611183	[]	[]	f
553	31	65	81	A-701	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.614003	2026-02-23 16:04:31.614003	[]	[]	f
554	31	65	81	A-702	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.61752	2026-02-23 16:04:31.61752	[]	[]	f
555	31	65	81	B-703	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.62077	2026-02-23 16:04:31.62077	[]	[]	f
556	31	65	81	A-704	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.624385	2026-02-23 16:04:31.624385	[]	[]	f
557	31	65	81	A-709	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.62741	2026-02-23 16:04:31.62741	[]	[]	f
558	31	65	81	E-706	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.630259	2026-02-23 16:04:31.630259	[]	[]	f
559	31	65	81	E-707	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.633821	2026-02-23 16:04:31.633821	[]	[]	f
560	31	65	81	E-708	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.636775	2026-02-23 16:04:31.636775	[]	[]	f
561	31	65	81	E-709	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.639487	2026-02-23 16:04:31.639487	[]	[]	f
562	31	65	81	E-710	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.642417	2026-02-23 16:04:31.642417	[]	[]	f
563	31	65	81	E-705	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.64516	2026-02-23 16:04:31.64516	[]	[]	f
564	31	65	82	A-801	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.648556	2026-02-23 16:04:31.648556	[]	[]	f
565	31	65	82	A-802	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.651545	2026-02-23 16:04:31.651545	[]	[]	f
566	31	65	82	B-803	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.65428	2026-02-23 16:04:31.65428	[]	[]	f
567	31	65	82	A-804	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.657103	2026-02-23 16:04:31.657103	[]	[]	f
568	31	65	82	A-809	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.659815	2026-02-23 16:04:31.659815	[]	[]	f
569	31	65	82	E-806 (I)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.662713	2026-02-23 16:04:31.662713	[]	[]	f
570	31	65	82	E-806 (II)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.666072	2026-02-23 16:04:31.666072	[]	[]	f
571	31	65	82	E-807	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.669232	2026-02-23 16:04:31.669232	[]	[]	f
576	31	65	82	E-808	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:21:43.349591	2026-02-23 16:21:43.349591	{}	{}	f
577	31	65	82	E-809	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:21:53.328168	2026-02-23 16:21:53.328168	{}	{}	f
578	31	65	82	E-810	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:22:03.08544	2026-02-23 16:22:03.08544	{}	{}	f
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password, role, society_apartment_id, unit_id, cnic, contact_number, emergency_contact, move_in_date, created_at, updated_at, is_active, last_login, created_by, profile_image, address, city, postal_code, work_employer, work_title, work_phone) FROM stdin;
64	User C-110	user_322_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	322	\N	\N	\N	\N	2026-02-24 11:52:58.057142	2026-02-24 11:52:58.057142	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
54	Hamza Iqbal	user_311_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	311	\N	\N	\N	\N	2026-02-24 11:52:58.023136	2026-02-24 12:10:57.722721	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
65	User C-111	user_323_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	323	\N	\N	\N	\N	2026-02-24 11:52:58.059573	2026-02-24 11:52:58.059573	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
57	User B-103	user_315_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	315	\N	\N	\N	\N	2026-02-24 11:52:58.028282	2026-02-24 11:52:58.028282	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
58	User A-104	user_316_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	316	\N	\N	\N	\N	2026-02-24 11:52:58.030428	2026-02-24 11:52:58.030428	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
59	User A-105	user_317_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	317	\N	\N	\N	\N	2026-02-24 11:52:58.036484	2026-02-24 11:52:58.036484	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
60	User C-106	user_318_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	318	\N	\N	\N	\N	2026-02-24 11:52:58.04041	2026-02-24 11:52:58.04041	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
61	User C-107	user_319_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	319	\N	\N	\N	\N	2026-02-24 11:52:58.044769	2026-02-24 11:52:58.044769	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
62	User C-108	user_320_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	320	\N	\N	\N	\N	2026-02-24 11:52:58.051357	2026-02-24 11:52:58.051357	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
63	User C-109	user_321_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	321	\N	\N	\N	\N	2026-02-24 11:52:58.054308	2026-02-24 11:52:58.054308	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
66	User A-201	user_325_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	325	\N	\N	\N	\N	2026-02-24 11:52:58.061924	2026-02-24 11:52:58.061924	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
67	User A-202	user_326_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	326	\N	\N	\N	\N	2026-02-24 11:52:58.063849	2026-02-24 11:52:58.063849	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
68	User B-203	user_327_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	327	\N	\N	\N	\N	2026-02-24 11:52:58.068302	2026-02-24 11:52:58.068302	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
69	User A-204	user_328_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	328	\N	\N	\N	\N	2026-02-24 11:52:58.075293	2026-02-24 11:52:58.075293	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
70	User A-205	user_329_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	329	\N	\N	\N	\N	2026-02-24 11:52:58.078684	2026-02-24 11:52:58.078684	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
71	User C-206	user_330_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	330	\N	\N	\N	\N	2026-02-24 11:52:58.083632	2026-02-24 11:52:58.083632	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
72	User C-207	user_331_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	331	\N	\N	\N	\N	2026-02-24 11:52:58.091326	2026-02-24 11:52:58.091326	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
73	User C-208	user_332_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	332	\N	\N	\N	\N	2026-02-24 11:52:58.09404	2026-02-24 11:52:58.09404	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
74	User C-209	user_333_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	333	\N	\N	\N	\N	2026-02-24 11:52:58.096532	2026-02-24 11:52:58.096532	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
75	User D-210	user_334_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	334	\N	\N	\N	\N	2026-02-24 11:52:58.101625	2026-02-24 11:52:58.101625	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
76	User A1-209	user_335_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	335	\N	\N	\N	\N	2026-02-24 11:52:58.108009	2026-02-24 11:52:58.108009	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
77	User A-301	user_337_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	337	\N	\N	\N	\N	2026-02-24 11:52:58.111108	2026-02-24 11:52:58.111108	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
78	User A-302	user_338_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	338	\N	\N	\N	\N	2026-02-24 11:52:58.113627	2026-02-24 11:52:58.113627	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
79	User B-303	user_339_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	339	\N	\N	\N	\N	2026-02-24 11:52:58.120366	2026-02-24 11:52:58.120366	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
80	User A-304	user_340_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	340	\N	\N	\N	\N	2026-02-24 11:52:58.125911	2026-02-24 11:52:58.125911	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
81	User A-305	user_341_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	341	\N	\N	\N	\N	2026-02-24 11:52:58.12831	2026-02-24 11:52:58.12831	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
82	User C-306	user_342_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	342	\N	\N	\N	\N	2026-02-24 11:52:58.132194	2026-02-24 11:52:58.132194	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
83	User C-307	user_343_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	343	\N	\N	\N	\N	2026-02-24 11:52:58.139409	2026-02-24 11:52:58.139409	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
84	User C-308	user_344_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	344	\N	\N	\N	\N	2026-02-24 11:52:58.142658	2026-02-24 11:52:58.142658	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
85	User C-309	user_345_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	345	\N	\N	\N	\N	2026-02-24 11:52:58.145194	2026-02-24 11:52:58.145194	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
86	User D-310	user_346_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	346	\N	\N	\N	\N	2026-02-24 11:52:58.14832	2026-02-24 11:52:58.14832	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
87	User A1-309	user_347_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	347	\N	\N	\N	\N	2026-02-24 11:52:58.153306	2026-02-24 11:52:58.153306	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
88	User A-401	user_349_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	349	\N	\N	\N	\N	2026-02-24 11:52:58.15858	2026-02-24 11:52:58.15858	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
89	User A-402	user_350_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	350	\N	\N	\N	\N	2026-02-24 11:52:58.161287	2026-02-24 11:52:58.161287	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
90	User B-403	user_351_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	351	\N	\N	\N	\N	2026-02-24 11:52:58.163865	2026-02-24 11:52:58.163865	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
91	User A-404	user_352_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	352	\N	\N	\N	\N	2026-02-24 11:52:58.169326	2026-02-24 11:52:58.169326	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
92	User A-405	user_353_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	353	\N	\N	\N	\N	2026-02-24 11:52:58.173195	2026-02-24 11:52:58.173195	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
93	User E-406	user_354_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	354	\N	\N	\N	\N	2026-02-24 11:52:58.175076	2026-02-24 11:52:58.175076	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
53	Zainab Farooq	user_310_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	310	\N	\N	\N	\N	2026-02-24 11:52:58.020204	2026-02-24 12:11:13.749794	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
52	Saad Ahmed	user_309_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	309	\N	\N	\N	\N	2026-02-24 11:52:58.017913	2026-02-24 12:11:26.617998	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
51	Aisha Siddiqui	user_308_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	308	\N	\N	\N	\N	2026-02-24 11:52:57.982552	2026-02-24 12:11:43.045666	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
55	Hassan Raza	user_313_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	313	\N	\N	\N	\N	2026-02-24 11:52:58.025227	2026-02-24 14:35:40.553371	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
56	Sana Malik	user_314_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	314	\N	\N	\N	\N	2026-02-24 11:52:58.026791	2026-02-24 14:35:57.432885	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
126	User E-706	user_390_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	390	\N	\N	\N	\N	2026-02-24 11:52:58.27339	2026-02-24 11:52:58.27339	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
127	User E-707	user_391_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	391	\N	\N	\N	\N	2026-02-24 11:52:58.275267	2026-02-24 11:52:58.275267	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
50	Muhammad Ali	user1@gmail.com	$2a$10$4jb3C3uJSBIxjgHBuKbege83EbO2yPpou2EuAGm28ymzRlreEPql6	resident	31	307	\N	\N	\N	2026-02-22	2026-02-23 16:43:30.296096	2026-02-24 12:12:09.597053	\N	\N	49	\N	\N	\N	\N	\N	\N	\N
94	User E-407	user_355_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	355	\N	\N	\N	\N	2026-02-24 11:52:58.176708	2026-02-24 11:52:58.176708	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
95	User E-408	user_356_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	356	\N	\N	\N	\N	2026-02-24 11:52:58.179009	2026-02-24 11:52:58.179009	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
96	User E-409	user_357_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	357	\N	\N	\N	\N	2026-02-24 11:52:58.18151	2026-02-24 11:52:58.18151	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
97	User E-410	user_358_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	358	\N	\N	\N	\N	2026-02-24 11:52:58.18776	2026-02-24 11:52:58.18776	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
98	User E-411	user_359_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	359	\N	\N	\N	\N	2026-02-24 11:52:58.191251	2026-02-24 11:52:58.191251	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
99	User A-501	user_361_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	361	\N	\N	\N	\N	2026-02-24 11:52:58.193232	2026-02-24 11:52:58.193232	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
100	User A-502	user_362_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	362	\N	\N	\N	\N	2026-02-24 11:52:58.195186	2026-02-24 11:52:58.195186	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
101	User B-503	user_363_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	363	\N	\N	\N	\N	2026-02-24 11:52:58.197449	2026-02-24 11:52:58.197449	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
102	User A-504	user_364_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	364	\N	\N	\N	\N	2026-02-24 11:52:58.202104	2026-02-24 11:52:58.202104	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
103	User A-505	user_365_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	365	\N	\N	\N	\N	2026-02-24 11:52:58.207288	2026-02-24 11:52:58.207288	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
104	User E-506	user_366_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	366	\N	\N	\N	\N	2026-02-24 11:52:58.209134	2026-02-24 11:52:58.209134	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
105	User E-507	user_367_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	367	\N	\N	\N	\N	2026-02-24 11:52:58.210911	2026-02-24 11:52:58.210911	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
106	User E-508	user_368_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	368	\N	\N	\N	\N	2026-02-24 11:52:58.213155	2026-02-24 11:52:58.213155	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
107	User E-509	user_369_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	369	\N	\N	\N	\N	2026-02-24 11:52:58.217346	2026-02-24 11:52:58.217346	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
108	User E-510	user_370_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	370	\N	\N	\N	\N	2026-02-24 11:52:58.223163	2026-02-24 11:52:58.223163	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
109	User E-511	user_371_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	371	\N	\N	\N	\N	2026-02-24 11:52:58.226213	2026-02-24 11:52:58.226213	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
110	User A-601	user_373_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	373	\N	\N	\N	\N	2026-02-24 11:52:58.228143	2026-02-24 11:52:58.228143	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
111	User A-602	user_374_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	374	\N	\N	\N	\N	2026-02-24 11:52:58.230046	2026-02-24 11:52:58.230046	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
112	User B-603	user_375_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	375	\N	\N	\N	\N	2026-02-24 11:52:58.234324	2026-02-24 11:52:58.234324	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
113	User A-604	user_376_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	376	\N	\N	\N	\N	2026-02-24 11:52:58.239691	2026-02-24 11:52:58.239691	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
114	User A-605	user_377_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	377	\N	\N	\N	\N	2026-02-24 11:52:58.241249	2026-02-24 11:52:58.241249	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
115	User E-606	user_378_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	378	\N	\N	\N	\N	2026-02-24 11:52:58.243074	2026-02-24 11:52:58.243074	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
116	User E-607	user_379_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	379	\N	\N	\N	\N	2026-02-24 11:52:58.245033	2026-02-24 11:52:58.245033	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
117	User E-608	user_380_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	380	\N	\N	\N	\N	2026-02-24 11:52:58.246829	2026-02-24 11:52:58.246829	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
118	User E-609	user_381_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	381	\N	\N	\N	\N	2026-02-24 11:52:58.251018	2026-02-24 11:52:58.251018	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
128	User E-708	user_392_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	392	\N	\N	\N	\N	2026-02-24 11:52:58.276958	2026-02-24 11:52:58.276958	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
119	User E-610	user_382_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	382	\N	\N	\N	\N	2026-02-24 11:52:58.255505	2026-02-24 11:52:58.255505	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
120	User E-611	user_383_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	383	\N	\N	\N	\N	2026-02-24 11:52:58.257443	2026-02-24 11:52:58.257443	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
121	User A-701	user_385_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	385	\N	\N	\N	\N	2026-02-24 11:52:58.258927	2026-02-24 11:52:58.258927	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
122	User A-702	user_386_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	386	\N	\N	\N	\N	2026-02-24 11:52:58.261004	2026-02-24 11:52:58.261004	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
123	User B-703	user_387_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	387	\N	\N	\N	\N	2026-02-24 11:52:58.262539	2026-02-24 11:52:58.262539	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
124	User A-704	user_388_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	388	\N	\N	\N	\N	2026-02-24 11:52:58.264331	2026-02-24 11:52:58.264331	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
125	User A-705	user_389_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	389	\N	\N	\N	\N	2026-02-24 11:52:58.268862	2026-02-24 11:52:58.268862	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
129	User E-709	user_393_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	393	\N	\N	\N	\N	2026-02-24 11:52:58.279047	2026-02-24 11:52:58.279047	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
130	User E-710	user_394_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	394	\N	\N	\N	\N	2026-02-24 11:52:58.281247	2026-02-24 11:52:58.281247	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
131	User E-711	user_395_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	395	\N	\N	\N	\N	2026-02-24 11:52:58.285328	2026-02-24 11:52:58.285328	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
132	User A-801	user_397_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	397	\N	\N	\N	\N	2026-02-24 11:52:58.289806	2026-02-24 11:52:58.289806	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
133	User A-802	user_398_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	398	\N	\N	\N	\N	2026-02-24 11:52:58.292017	2026-02-24 11:52:58.292017	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
134	User B-803	user_399_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	399	\N	\N	\N	\N	2026-02-24 11:52:58.293886	2026-02-24 11:52:58.293886	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
135	User A-804	user_400_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	400	\N	\N	\N	\N	2026-02-24 11:52:58.295608	2026-02-24 11:52:58.295608	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
136	User A-805	user_401_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	401	\N	\N	\N	\N	2026-02-24 11:52:58.297183	2026-02-24 11:52:58.297183	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
137	User E-806	user_402_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	402	\N	\N	\N	\N	2026-02-24 11:52:58.304405	2026-02-24 11:52:58.304405	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
138	User E-807	user_403_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	403	\N	\N	\N	\N	2026-02-24 11:52:58.307789	2026-02-24 11:52:58.307789	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
139	User E-808	user_404_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	404	\N	\N	\N	\N	2026-02-24 11:52:58.309403	2026-02-24 11:52:58.309403	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
140	User E-809	user_405_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	405	\N	\N	\N	\N	2026-02-24 11:52:58.311073	2026-02-24 11:52:58.311073	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
141	User E-810	user_406_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	406	\N	\N	\N	\N	2026-02-24 11:52:58.312633	2026-02-24 11:52:58.312633	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
142	User E-811	user_407_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	407	\N	\N	\N	\N	2026-02-24 11:52:58.314442	2026-02-24 11:52:58.314442	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
143	User A-101	user_491_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	491	\N	\N	\N	\N	2026-02-24 11:52:58.31814	2026-02-24 11:52:58.31814	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
144	User A-102	user_492_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	492	\N	\N	\N	\N	2026-02-24 11:52:58.322286	2026-02-24 11:52:58.322286	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
145	User B-103	user_493_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	493	\N	\N	\N	\N	2026-02-24 11:52:58.324241	2026-02-24 11:52:58.324241	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
146	User A-104	user_494_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	494	\N	\N	\N	\N	2026-02-24 11:52:58.325994	2026-02-24 11:52:58.325994	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
147	User C-109	user_495_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	495	\N	\N	\N	\N	2026-02-24 11:52:58.327702	2026-02-24 11:52:58.327702	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
148	User C-106	user_496_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	496	\N	\N	\N	\N	2026-02-24 11:52:58.329306	2026-02-24 11:52:58.329306	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
149	User C-107	user_497_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	497	\N	\N	\N	\N	2026-02-24 11:52:58.332259	2026-02-24 11:52:58.332259	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
150	User C-108	user_498_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	498	\N	\N	\N	\N	2026-02-24 11:52:58.336506	2026-02-24 11:52:58.336506	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
151	User A2-109	user_499_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	499	\N	\N	\N	\N	2026-02-24 11:52:58.340141	2026-02-24 11:52:58.340141	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
152	User A1-105	user_500_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	500	\N	\N	\N	\N	2026-02-24 11:52:58.342035	2026-02-24 11:52:58.342035	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
153	User A-201	user_501_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	501	\N	\N	\N	\N	2026-02-24 11:52:58.343705	2026-02-24 11:52:58.343705	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
154	User A-202	user_502_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	502	\N	\N	\N	\N	2026-02-24 11:52:58.345332	2026-02-24 11:52:58.345332	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
155	User B-203	user_503_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	503	\N	\N	\N	\N	2026-02-24 11:52:58.346681	2026-02-24 11:52:58.346681	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
156	User A-204	user_504_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	504	\N	\N	\N	\N	2026-02-24 11:52:58.35033	2026-02-24 11:52:58.35033	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
157	User A-209	user_505_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	505	\N	\N	\N	\N	2026-02-24 11:52:58.355285	2026-02-24 11:52:58.355285	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
158	User C-206	user_506_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	506	\N	\N	\N	\N	2026-02-24 11:52:58.358622	2026-02-24 11:52:58.358622	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
159	User C-207	user_507_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	507	\N	\N	\N	\N	2026-02-24 11:52:58.360685	2026-02-24 11:52:58.360685	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
160	User C-208	user_508_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	508	\N	\N	\N	\N	2026-02-24 11:52:58.362309	2026-02-24 11:52:58.362309	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
161	User A2-209	user_509_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	509	\N	\N	\N	\N	2026-02-24 11:52:58.363925	2026-02-24 11:52:58.363925	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
162	User A1-205	user_510_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	510	\N	\N	\N	\N	2026-02-24 11:52:58.368823	2026-02-24 11:52:58.368823	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
163	User A-301	user_511_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	511	\N	\N	\N	\N	2026-02-24 11:52:58.373316	2026-02-24 11:52:58.373316	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
164	User A-302	user_512_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	512	\N	\N	\N	\N	2026-02-24 11:52:58.375321	2026-02-24 11:52:58.375321	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
165	User B-303	user_513_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	513	\N	\N	\N	\N	2026-02-24 11:52:58.377125	2026-02-24 11:52:58.377125	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
166	User A-304	user_514_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	514	\N	\N	\N	\N	2026-02-24 11:52:58.378588	2026-02-24 11:52:58.378588	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
167	User A-309	user_515_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	515	\N	\N	\N	\N	2026-02-24 11:52:58.38109	2026-02-24 11:52:58.38109	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
168	User C-306	user_516_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	516	\N	\N	\N	\N	2026-02-24 11:52:58.386318	2026-02-24 11:52:58.386318	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
169	User C-307	user_517_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	517	\N	\N	\N	\N	2026-02-24 11:52:58.391074	2026-02-24 11:52:58.391074	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
170	User D-309	user_518_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	518	\N	\N	\N	\N	2026-02-24 11:52:58.393528	2026-02-24 11:52:58.393528	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
171	User C-310	user_519_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	519	\N	\N	\N	\N	2026-02-24 11:52:58.395341	2026-02-24 11:52:58.395341	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
172	User A1-305	user_520_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	520	\N	\N	\N	\N	2026-02-24 11:52:58.396908	2026-02-24 11:52:58.396908	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
173	User A-401	user_521_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	521	\N	\N	\N	\N	2026-02-24 11:52:58.401101	2026-02-24 11:52:58.401101	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
174	User A-402	user_522_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	522	\N	\N	\N	\N	2026-02-24 11:52:58.406307	2026-02-24 11:52:58.406307	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
175	User B-403	user_523_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	523	\N	\N	\N	\N	2026-02-24 11:52:58.408265	2026-02-24 11:52:58.408265	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
176	User A-404	user_524_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	524	\N	\N	\N	\N	2026-02-24 11:52:58.410112	2026-02-24 11:52:58.410112	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
177	User A-409	user_525_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	525	\N	\N	\N	\N	2026-02-24 11:52:58.412153	2026-02-24 11:52:58.412153	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
178	User C-406	user_526_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	526	\N	\N	\N	\N	2026-02-24 11:52:58.414671	2026-02-24 11:52:58.414671	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
179	User C-407	user_527_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	527	\N	\N	\N	\N	2026-02-24 11:52:58.423011	2026-02-24 11:52:58.423011	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
180	User C-408	user_528_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	528	\N	\N	\N	\N	2026-02-24 11:52:58.425595	2026-02-24 11:52:58.425595	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
181	User A2-409	user_529_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	529	\N	\N	\N	\N	2026-02-24 11:52:58.428192	2026-02-24 11:52:58.428192	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
182	User A1-405	user_530_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	530	\N	\N	\N	\N	2026-02-24 11:52:58.430631	2026-02-24 11:52:58.430631	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
183	User A-501	user_531_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	531	\N	\N	\N	\N	2026-02-24 11:52:58.44362	2026-02-24 11:52:58.44362	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
184	User A-502	user_532_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	532	\N	\N	\N	\N	2026-02-24 11:52:58.445718	2026-02-24 11:52:58.445718	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
185	User B-503	user_533_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	533	\N	\N	\N	\N	2026-02-24 11:52:58.447836	2026-02-24 11:52:58.447836	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
186	User A-504	user_534_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	534	\N	\N	\N	\N	2026-02-24 11:52:58.454228	2026-02-24 11:52:58.454228	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
187	User A-509	user_535_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	535	\N	\N	\N	\N	2026-02-24 11:52:58.459242	2026-02-24 11:52:58.459242	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
188	User E-506	user_536_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	536	\N	\N	\N	\N	2026-02-24 11:52:58.461765	2026-02-24 11:52:58.461765	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
189	User E-507	user_537_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	537	\N	\N	\N	\N	2026-02-24 11:52:58.464555	2026-02-24 11:52:58.464555	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
190	User E-508	user_538_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	538	\N	\N	\N	\N	2026-02-24 11:52:58.470901	2026-02-24 11:52:58.470901	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
191	User E-509	user_539_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	539	\N	\N	\N	\N	2026-02-24 11:52:58.47527	2026-02-24 11:52:58.47527	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
192	User E-510	user_540_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	540	\N	\N	\N	\N	2026-02-24 11:52:58.477745	2026-02-24 11:52:58.477745	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
193	User E-505	user_541_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	541	\N	\N	\N	\N	2026-02-24 11:52:58.480157	2026-02-24 11:52:58.480157	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
194	User A-601	user_542_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	542	\N	\N	\N	\N	2026-02-24 11:52:58.485	2026-02-24 11:52:58.485	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
195	User A-602	user_543_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	543	\N	\N	\N	\N	2026-02-24 11:52:58.490873	2026-02-24 11:52:58.490873	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
196	User B-603	user_544_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	544	\N	\N	\N	\N	2026-02-24 11:52:58.493277	2026-02-24 11:52:58.493277	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
197	User A-604	user_545_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	545	\N	\N	\N	\N	2026-02-24 11:52:58.495543	2026-02-24 11:52:58.495543	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
198	User A-609	user_546_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	546	\N	\N	\N	\N	2026-02-24 11:52:58.497944	2026-02-24 11:52:58.497944	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
199	User E-606	user_547_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	547	\N	\N	\N	\N	2026-02-24 11:52:58.503819	2026-02-24 11:52:58.503819	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
200	User E-607	user_548_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	548	\N	\N	\N	\N	2026-02-24 11:52:58.50775	2026-02-24 11:52:58.50775	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
201	User E-608	user_549_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	549	\N	\N	\N	\N	2026-02-24 11:52:58.509712	2026-02-24 11:52:58.509712	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
202	User E-609	user_550_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	550	\N	\N	\N	\N	2026-02-24 11:52:58.511641	2026-02-24 11:52:58.511641	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
203	User E-610	user_551_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	551	\N	\N	\N	\N	2026-02-24 11:52:58.513766	2026-02-24 11:52:58.513766	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
204	User E-605	user_552_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	552	\N	\N	\N	\N	2026-02-24 11:52:58.518331	2026-02-24 11:52:58.518331	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
205	User A-701	user_553_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	553	\N	\N	\N	\N	2026-02-24 11:52:58.524	2026-02-24 11:52:58.524	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
206	User A-702	user_554_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	554	\N	\N	\N	\N	2026-02-24 11:52:58.526238	2026-02-24 11:52:58.526238	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
207	User B-703	user_555_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	555	\N	\N	\N	\N	2026-02-24 11:52:58.528402	2026-02-24 11:52:58.528402	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
208	User A-704	user_556_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	556	\N	\N	\N	\N	2026-02-24 11:52:58.530283	2026-02-24 11:52:58.530283	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
209	User A-709	user_557_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	557	\N	\N	\N	\N	2026-02-24 11:52:58.535094	2026-02-24 11:52:58.535094	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
210	User E-706	user_558_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	558	\N	\N	\N	\N	2026-02-24 11:52:58.541442	2026-02-24 11:52:58.541442	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
211	User E-707	user_559_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	559	\N	\N	\N	\N	2026-02-24 11:52:58.54393	2026-02-24 11:52:58.54393	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
212	User E-708	user_560_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	560	\N	\N	\N	\N	2026-02-24 11:52:58.546855	2026-02-24 11:52:58.546855	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
213	User E-709	user_561_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	561	\N	\N	\N	\N	2026-02-24 11:52:58.551332	2026-02-24 11:52:58.551332	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
214	User E-710	user_562_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	562	\N	\N	\N	\N	2026-02-24 11:52:58.55765	2026-02-24 11:52:58.55765	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
215	User E-705	user_563_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	563	\N	\N	\N	\N	2026-02-24 11:52:58.562137	2026-02-24 11:52:58.562137	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
216	User A-801	user_564_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	564	\N	\N	\N	\N	2026-02-24 11:52:58.564723	2026-02-24 11:52:58.564723	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
217	User A-802	user_565_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	565	\N	\N	\N	\N	2026-02-24 11:52:58.569913	2026-02-24 11:52:58.569913	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
218	User B-803	user_566_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	566	\N	\N	\N	\N	2026-02-24 11:52:58.574144	2026-02-24 11:52:58.574144	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
219	User A-804	user_567_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	567	\N	\N	\N	\N	2026-02-24 11:52:58.576371	2026-02-24 11:52:58.576371	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
220	User A-809	user_568_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	568	\N	\N	\N	\N	2026-02-24 11:52:58.578402	2026-02-24 11:52:58.578402	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
221	User E-806 (I)	user_569_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	569	\N	\N	\N	\N	2026-02-24 11:52:58.580499	2026-02-24 11:52:58.580499	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
222	User E-806 (II)	user_570_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	570	\N	\N	\N	\N	2026-02-24 11:52:58.585512	2026-02-24 11:52:58.585512	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
223	User E-807	user_571_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	571	\N	\N	\N	\N	2026-02-24 11:52:58.590714	2026-02-24 11:52:58.590714	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
224	User E-808	user_576_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	576	\N	\N	\N	\N	2026-02-24 11:52:58.593138	2026-02-24 11:52:58.593138	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
225	User E-809	user_577_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	577	\N	\N	\N	\N	2026-02-24 11:52:58.595763	2026-02-24 11:52:58.595763	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
226	User E-810	user_578_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	578	\N	\N	\N	\N	2026-02-24 11:52:58.598913	2026-02-24 11:52:58.598913	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
227	User E-805	user_579_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	579	\N	\N	\N	\N	2026-02-24 11:52:58.606347	2026-02-24 11:52:58.606347	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
228	Muhammad Iqbal	staff-31-1771920723441-4ad56765@no-login.local	$2a$10$RND7SFxzup/.K5qp0BmJwuKxGs4Uhm5sLV1SkTYng.eomYe963hlO	staff	31	\N	\N	\N	\N	\N	2026-02-24 13:12:03.541218	2026-02-24 13:12:03.541218	\N	\N	49	\N	\N	\N	\N	\N	Supervisor	\N
229	Fazal	staff-31-1771920866635-01264fad@no-login.local	$2a$10$SLDE9VB1y8evbejSv7hkCOI3XiWh9zYbVFiNnSWSiTyGYoK0KBHxa	staff	31	\N	\N	\N	\N	\N	2026-02-24 13:14:26.721668	2026-02-24 13:14:26.721668	\N	\N	49	\N	\N	\N	\N	\N	Guard	\N
230	Gul Muhammad	staff-31-1771920893201-f0f0d79c@no-login.local	$2a$10$YF2MDUUb/r581boioR7GX.wUWEo8GF9Vzb9LNjuxnLmx7GK/H4yV.	staff	31	\N	\N	\N	\N	\N	2026-02-24 13:14:53.278925	2026-02-24 13:14:53.278925	\N	\N	49	\N	\N	\N	\N	\N	Guard	\N
231	Muhammad Ayub	staff-31-1771920929335-2669b9aa@no-login.local	$2a$10$4Hs2j/rMKB7W7eM6.Gsl9.on65t52LGazNKKdM/iW8kHpuvqD.dMu	staff	31	\N	\N	\N	\N	\N	2026-02-24 13:15:29.4133	2026-02-24 13:15:29.4133	\N	\N	49	\N	\N	\N	\N	\N	Guard	\N
232	Nazir Baba	staff-31-1771920951385-c37a2999@no-login.local	$2a$10$s6dgVU0zvVGrflKMJE/9CeWqGHqk63E9J/7uiQigUv9/HhPl2HE1q	staff	31	\N	\N	\N	\N	\N	2026-02-24 13:15:51.462937	2026-02-24 13:15:51.462937	\N	\N	49	\N	\N	\N	\N	\N	Guard	\N
233	Abdullah	staff-31-1771920983533-e2c91a7d@no-login.local	$2a$10$Lvyl9OZVZrbT7GJAVAuhFe/MOX7fJ4ZtQhtJy6SBjbcah58lFZX5u	staff	31	\N	\N	\N	\N	\N	2026-02-24 13:16:23.612409	2026-02-24 13:16:23.612409	\N	\N	49	\N	\N	\N	\N	\N	Sweeper	\N
234	Zahoor	staff-31-1771921012737-8b33350c@no-login.local	$2a$10$.DxUksKI4eJLzZHzDD8WuueBFT0rP6F.aF1cHassenVq1DVwsqqK2	staff	31	\N	\N	\N	\N	\N	2026-02-24 13:16:52.814365	2026-02-24 13:18:19.487939	\N	\N	49	\N	\N	\N	\N	\N	Lift Operator	\N
1	Sheikh Hasan Khalid	hasanshkh17@gmail.com	$2a$10$vykkG6yqvExk.QnANIb/JOL3jvno5Fjp6LIDOqY7pyayI9KmOr2ym	super_admin	\N	\N	\N	+92 301 1457030	0332 3883890	\N	2026-01-26 16:45:51.541343	2026-02-25 10:55:28.328372	t	2026-02-25 10:55:28.328372+05	\N	/uploads/profiles/user_1_1771582975987.webp	\N	\N	\N	\N	\N	\N
49	Muneeb Khan	muneebkhan@gmail.com	$2a$10$62QQO3GhzyB/gmc1pL8M/e0jT.YqxF3sM6G9HEOKhQfA8DEuaMHvi	union_admin	31	\N	012012012012	0101	1010	\N	2026-02-23 12:52:19.304651	2026-02-25 11:05:11.850799	t	2026-02-25 11:05:11.850799+05	1	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Name: announcements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.announcements_id_seq', 39, true);


--
-- Name: blocks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blocks_id_seq', 65, true);


--
-- Name: complaint_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.complaint_progress_id_seq', 1, false);


--
-- Name: complaints_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.complaints_id_seq', 50, true);


--
-- Name: defaulters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.defaulters_id_seq', 32, true);


--
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.employees_id_seq', 7, true);


--
-- Name: family_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.family_members_id_seq', 2, true);


--
-- Name: finance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.finance_id_seq', 136, true);


--
-- Name: floors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.floors_id_seq', 82, true);


--
-- Name: maintenance_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.maintenance_config_id_seq', 5, true);


--
-- Name: maintenance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.maintenance_id_seq', 6679, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.messages_id_seq', 4, true);


--
-- Name: monthly_dues_generation_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.monthly_dues_generation_log_id_seq', 1, false);


--
-- Name: payment_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payment_history_id_seq', 1, false);


--
-- Name: push_subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.push_subscriptions_id_seq', 1, false);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.settings_id_seq', 3, true);


--
-- Name: societies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.societies_id_seq', 31, true);


--
-- Name: subscription_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.subscription_plans_id_seq', 1, true);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 24, true);


--
-- Name: super_admin_invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.super_admin_invoices_id_seq', 4, true);


--
-- Name: union_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.union_members_id_seq', 1, true);


--
-- Name: units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.units_id_seq', 579, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 234, true);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: blocks blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT blocks_pkey PRIMARY KEY (id);


--
-- Name: complaint_progress complaint_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint_progress
    ADD CONSTRAINT complaint_progress_pkey PRIMARY KEY (id);


--
-- Name: complaints complaints_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_pkey PRIMARY KEY (id);


--
-- Name: defaulters defaulters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defaulters
    ADD CONSTRAINT defaulters_pkey PRIMARY KEY (id);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: employees employees_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_key UNIQUE (user_id);


--
-- Name: family_members family_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.family_members
    ADD CONSTRAINT family_members_pkey PRIMARY KEY (id);


--
-- Name: finance finance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance
    ADD CONSTRAINT finance_pkey PRIMARY KEY (id);


--
-- Name: floors floors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.floors
    ADD CONSTRAINT floors_pkey PRIMARY KEY (id);


--
-- Name: maintenance_config maintenance_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenance_config
    ADD CONSTRAINT maintenance_config_pkey PRIMARY KEY (id);


--
-- Name: maintenance maintenance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenance
    ADD CONSTRAINT maintenance_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: monthly_dues_generation_log monthly_dues_generation_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.monthly_dues_generation_log
    ADD CONSTRAINT monthly_dues_generation_log_pkey PRIMARY KEY (id);


--
-- Name: payment_history payment_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT payment_history_pkey PRIMARY KEY (id);


--
-- Name: push_subscriptions push_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: push_subscriptions push_subscriptions_user_id_endpoint_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_user_id_endpoint_key UNIQUE (user_id, endpoint);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: apartments societies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.apartments
    ADD CONSTRAINT societies_pkey PRIMARY KEY (id);


--
-- Name: subscription_plans subscription_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_society_apartment_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_society_apartment_id_key UNIQUE (society_apartment_id);


--
-- Name: subscriptions subscriptions_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);


--
-- Name: super_admin_invoices super_admin_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.super_admin_invoices
    ADD CONSTRAINT super_admin_invoices_pkey PRIMARY KEY (id);


--
-- Name: union_members union_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.union_members
    ADD CONSTRAINT union_members_pkey PRIMARY KEY (id);


--
-- Name: units units_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_complaint_progress_complaint_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_complaint_progress_complaint_id ON public.complaint_progress USING btree (complaint_id);


--
-- Name: idx_complaint_progress_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_complaint_progress_created_at ON public.complaint_progress USING btree (created_at DESC);


--
-- Name: idx_complaint_progress_updated_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_complaint_progress_updated_by ON public.complaint_progress USING btree (updated_by);


--
-- Name: idx_complaints_assigned; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_complaints_assigned ON public.complaints USING btree (assigned_to);


--
-- Name: idx_complaints_society; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_complaints_society ON public.complaints USING btree (society_apartment_id);


--
-- Name: idx_complaints_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_complaints_status ON public.complaints USING btree (status);


--
-- Name: idx_defaulters_society; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_defaulters_society ON public.defaulters USING btree (society_apartment_id);


--
-- Name: idx_defaulters_unit; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_defaulters_unit ON public.defaulters USING btree (unit_id);


--
-- Name: idx_employees_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_employees_created_by ON public.employees USING btree (created_by);


--
-- Name: idx_employees_society_apartment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_employees_society_apartment_id ON public.employees USING btree (society_apartment_id);


--
-- Name: idx_employees_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_employees_user_id ON public.employees USING btree (user_id);


--
-- Name: idx_family_members_resident; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_family_members_resident ON public.family_members USING btree (resident_id);


--
-- Name: idx_finance_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_finance_date ON public.finance USING btree (transaction_date);


--
-- Name: idx_finance_society; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_finance_society ON public.finance USING btree (society_apartment_id);


--
-- Name: idx_finance_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_finance_type ON public.finance USING btree (transaction_type);


--
-- Name: idx_maintenance_config_block; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_maintenance_config_block ON public.maintenance_config USING btree (block_id);


--
-- Name: idx_maintenance_config_unique_block; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_maintenance_config_unique_block ON public.maintenance_config USING btree (block_id, society_apartment_id) WHERE ((block_id IS NOT NULL) AND (unit_id IS NULL));


--
-- Name: idx_maintenance_config_unique_society; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_maintenance_config_unique_society ON public.maintenance_config USING btree (society_apartment_id) WHERE ((block_id IS NULL) AND (unit_id IS NULL));


--
-- Name: idx_maintenance_config_unique_unit; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_maintenance_config_unique_unit ON public.maintenance_config USING btree (unit_id) WHERE (unit_id IS NOT NULL);


--
-- Name: idx_maintenance_config_unit; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_maintenance_config_unit ON public.maintenance_config USING btree (unit_id);


--
-- Name: idx_maintenance_payment_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_maintenance_payment_date ON public.maintenance USING btree (payment_date);


--
-- Name: idx_maintenance_society; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_maintenance_society ON public.maintenance USING btree (society_apartment_id);


--
-- Name: idx_maintenance_unit; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_maintenance_unit ON public.maintenance USING btree (unit_id);


--
-- Name: idx_maintenance_year_month; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_maintenance_year_month ON public.maintenance USING btree (year, month);


--
-- Name: idx_messages_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_created ON public.messages USING btree (created_at DESC);


--
-- Name: idx_messages_receiver; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_receiver ON public.messages USING btree (receiver_id);


--
-- Name: idx_messages_sender; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_sender ON public.messages USING btree (sender_id);


--
-- Name: idx_monthly_dues_log_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_monthly_dues_log_date ON public.monthly_dues_generation_log USING btree (year DESC, month DESC);


--
-- Name: idx_monthly_dues_log_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_monthly_dues_log_unique ON public.monthly_dues_generation_log USING btree (year, month);


--
-- Name: idx_one_union_admin_per_society; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_one_union_admin_per_society ON public.users USING btree (society_apartment_id) WHERE (((role)::text = 'union_admin'::text) AND (society_apartment_id IS NOT NULL));


--
-- Name: idx_payment_history_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payment_history_created_at ON public.payment_history USING btree (created_at DESC);


--
-- Name: idx_payment_history_maintenance; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payment_history_maintenance ON public.payment_history USING btree (maintenance_id);


--
-- Name: idx_payment_history_updated_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payment_history_updated_by ON public.payment_history USING btree (updated_by);


--
-- Name: idx_push_subscriptions_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_push_subscriptions_user ON public.push_subscriptions USING btree (user_id);


--
-- Name: idx_subscriptions_next_billing; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_subscriptions_next_billing ON public.subscriptions USING btree (next_billing_date);


--
-- Name: idx_subscriptions_society; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_subscriptions_society ON public.subscriptions USING btree (society_apartment_id);


--
-- Name: idx_subscriptions_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_subscriptions_status ON public.subscriptions USING btree (status);


--
-- Name: idx_subscriptions_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_subscriptions_user ON public.subscriptions USING btree (user_id);


--
-- Name: idx_super_admin_invoices_due_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_super_admin_invoices_due_date ON public.super_admin_invoices USING btree (due_date);


--
-- Name: idx_super_admin_invoices_society; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_super_admin_invoices_society ON public.super_admin_invoices USING btree (society_apartment_id);


--
-- Name: idx_super_admin_invoices_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_super_admin_invoices_status ON public.super_admin_invoices USING btree (status);


--
-- Name: idx_super_admin_invoices_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_super_admin_invoices_user ON public.super_admin_invoices USING btree (user_id);


--
-- Name: idx_union_members_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_union_members_created_by ON public.union_members USING btree (created_by);


--
-- Name: idx_union_members_society_apartment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_union_members_society_apartment_id ON public.union_members USING btree (society_apartment_id);


--
-- Name: idx_union_members_unit_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_union_members_unit_id ON public.union_members USING btree (unit_id);


--
-- Name: idx_units_is_occupied; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_units_is_occupied ON public.units USING btree (is_occupied);


--
-- Name: idx_units_other_bills; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_units_other_bills ON public.units USING gin (other_bills);


--
-- Name: idx_units_telephone_bills; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_units_telephone_bills ON public.units USING gin (telephone_bills);


--
-- Name: idx_users_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_created_by ON public.users USING btree (created_by);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: idx_users_society; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_society ON public.users USING btree (society_apartment_id);


--
-- Name: announcements update_announcements_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: apartments update_apartments_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_apartments_updated_at BEFORE UPDATE ON public.apartments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: blocks update_blocks_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_blocks_updated_at BEFORE UPDATE ON public.blocks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: complaint_progress update_complaint_progress_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_complaint_progress_updated_at BEFORE UPDATE ON public.complaint_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: complaints update_complaints_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON public.complaints FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: defaulters update_defaulters_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_defaulters_updated_at BEFORE UPDATE ON public.defaulters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: finance update_finance_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_finance_updated_at BEFORE UPDATE ON public.finance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: maintenance_config update_maintenance_config_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_maintenance_config_updated_at BEFORE UPDATE ON public.maintenance_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: maintenance update_maintenance_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON public.maintenance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: settings update_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: subscription_plans update_subscription_plans_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON public.subscription_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: subscriptions update_subscriptions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: super_admin_invoices update_super_admin_invoices_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_super_admin_invoices_updated_at BEFORE UPDATE ON public.super_admin_invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: units update_units_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: announcements announcements_block_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_block_id_fkey FOREIGN KEY (block_id) REFERENCES public.blocks(id) ON DELETE SET NULL;


--
-- Name: announcements announcements_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: announcements announcements_society_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_society_apartment_id_fkey FOREIGN KEY (society_apartment_id) REFERENCES public.apartments(id) ON DELETE CASCADE;


--
-- Name: blocks blocks_society_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT blocks_society_apartment_id_fkey FOREIGN KEY (society_apartment_id) REFERENCES public.apartments(id) ON DELETE CASCADE;


--
-- Name: complaint_progress complaint_progress_complaint_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint_progress
    ADD CONSTRAINT complaint_progress_complaint_id_fkey FOREIGN KEY (complaint_id) REFERENCES public.complaints(id) ON DELETE CASCADE;


--
-- Name: complaint_progress complaint_progress_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint_progress
    ADD CONSTRAINT complaint_progress_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: complaints complaints_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: complaints complaints_society_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_society_apartment_id_fkey FOREIGN KEY (society_apartment_id) REFERENCES public.apartments(id) ON DELETE CASCADE;


--
-- Name: complaints complaints_submitted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: complaints complaints_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE SET NULL;


--
-- Name: defaulters defaulters_maintenance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defaulters
    ADD CONSTRAINT defaulters_maintenance_id_fkey FOREIGN KEY (maintenance_id) REFERENCES public.maintenance(id) ON DELETE SET NULL;


--
-- Name: defaulters defaulters_society_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defaulters
    ADD CONSTRAINT defaulters_society_apartment_id_fkey FOREIGN KEY (society_apartment_id) REFERENCES public.apartments(id) ON DELETE CASCADE;


--
-- Name: defaulters defaulters_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defaulters
    ADD CONSTRAINT defaulters_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE CASCADE;


--
-- Name: employees employees_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: employees employees_society_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_society_apartment_id_fkey FOREIGN KEY (society_apartment_id) REFERENCES public.apartments(id) ON DELETE CASCADE;


--
-- Name: employees employees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: family_members family_members_resident_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.family_members
    ADD CONSTRAINT family_members_resident_id_fkey FOREIGN KEY (resident_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: finance finance_added_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance
    ADD CONSTRAINT finance_added_by_fkey FOREIGN KEY (added_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: finance finance_society_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance
    ADD CONSTRAINT finance_society_apartment_id_fkey FOREIGN KEY (society_apartment_id) REFERENCES public.apartments(id) ON DELETE CASCADE;


--
-- Name: floors floors_block_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.floors
    ADD CONSTRAINT floors_block_id_fkey FOREIGN KEY (block_id) REFERENCES public.blocks(id) ON DELETE CASCADE;


--
-- Name: maintenance_config maintenance_config_block_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenance_config
    ADD CONSTRAINT maintenance_config_block_id_fkey FOREIGN KEY (block_id) REFERENCES public.blocks(id) ON DELETE CASCADE;


--
-- Name: maintenance_config maintenance_config_society_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenance_config
    ADD CONSTRAINT maintenance_config_society_apartment_id_fkey FOREIGN KEY (society_apartment_id) REFERENCES public.apartments(id) ON DELETE CASCADE;


--
-- Name: maintenance_config maintenance_config_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenance_config
    ADD CONSTRAINT maintenance_config_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE CASCADE;


--
-- Name: maintenance maintenance_society_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenance
    ADD CONSTRAINT maintenance_society_apartment_id_fkey FOREIGN KEY (society_apartment_id) REFERENCES public.apartments(id) ON DELETE CASCADE;


--
-- Name: maintenance maintenance_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenance
    ADD CONSTRAINT maintenance_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE CASCADE;


--
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payment_history payment_history_maintenance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT payment_history_maintenance_id_fkey FOREIGN KEY (maintenance_id) REFERENCES public.maintenance(id) ON DELETE CASCADE;


--
-- Name: payment_history payment_history_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT payment_history_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: push_subscriptions push_subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: settings settings_society_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_society_apartment_id_fkey FOREIGN KEY (society_apartment_id) REFERENCES public.apartments(id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id) ON DELETE SET NULL;


--
-- Name: subscriptions subscriptions_society_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_society_apartment_id_fkey FOREIGN KEY (society_apartment_id) REFERENCES public.apartments(id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: super_admin_invoices super_admin_invoices_society_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.super_admin_invoices
    ADD CONSTRAINT super_admin_invoices_society_apartment_id_fkey FOREIGN KEY (society_apartment_id) REFERENCES public.apartments(id) ON DELETE CASCADE;


--
-- Name: super_admin_invoices super_admin_invoices_subscription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.super_admin_invoices
    ADD CONSTRAINT super_admin_invoices_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id) ON DELETE SET NULL;


--
-- Name: super_admin_invoices super_admin_invoices_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.super_admin_invoices
    ADD CONSTRAINT super_admin_invoices_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: union_members union_members_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.union_members
    ADD CONSTRAINT union_members_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: union_members union_members_society_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.union_members
    ADD CONSTRAINT union_members_society_apartment_id_fkey FOREIGN KEY (society_apartment_id) REFERENCES public.apartments(id) ON DELETE CASCADE;


--
-- Name: union_members union_members_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.union_members
    ADD CONSTRAINT union_members_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE SET NULL;


--
-- Name: units units_block_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_block_id_fkey FOREIGN KEY (block_id) REFERENCES public.blocks(id) ON DELETE SET NULL;


--
-- Name: units units_floor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_floor_id_fkey FOREIGN KEY (floor_id) REFERENCES public.floors(id) ON DELETE SET NULL;


--
-- Name: units units_society_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_society_apartment_id_fkey FOREIGN KEY (society_apartment_id) REFERENCES public.apartments(id) ON DELETE CASCADE;


--
-- Name: users users_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict tKt9OyP1bBDHX7lDRQcrcWD3JSTMIEOi6UIUM8f9FhM6eMB1juhAY3yfRB2NLC0

