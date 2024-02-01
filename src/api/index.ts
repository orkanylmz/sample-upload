import { User } from "@/api/types";
import { supabase } from "@/lib/supabase";
import {
    AuthError,
    PostgrestError,
    PostgrestResponse,
} from "@supabase/supabase-js";
import { FileObject } from "@supabase/storage-js";

export type APIError = PostgrestError;
export type APIAuthError = AuthError;
export type File = FileObject & { url: string };

export const login = async (email: string, password: string): Promise<User> => {
    const response = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (response.error) {
        return Promise.reject(response.error);
    }

    return {
        id: response.data.user.id,
        email: response.data.user.email!,
    };
};

export const signup = async (email: string, password: string) => {
    const response = await supabase.auth.signUp({
        email,
        password,
    });

    console.log(response);

    if (response.error) {
        return Promise.reject(response.error);
    }

    return;
};

export const getFile = async (filename: string): Promise<File> => {
    const sessionRes = await supabase.auth.getSession();
    if (sessionRes.error) {
        return Promise.reject(sessionRes.error);
    }

    if (!sessionRes.data.session) {
        return Promise.reject("Unauthorized");
    }

    const {
        user: { id: userId },
    } = sessionRes.data.session;

    const response = await supabase.storage.from("files").list(`${userId}`, {
        limit: 1,
        search: filename,
    });

    if (response.error) {
        return Promise.reject(response.error);
    }

    const url = await createSignedUrl(response.data[0].name);

    return {
        ...response.data[0],
        url,
    };
};

export const getFiles = async (): Promise<File[]> => {
    const sessionRes = await supabase.auth.getSession();
    if (sessionRes.error) {
        return Promise.reject(sessionRes.error);
    }

    if (!sessionRes.data.session) {
        return Promise.reject("Unauthorized");
    }

    const {
        user: { id: userId },
    } = sessionRes.data.session;

    const response = await supabase.storage
        .from("files")
        .list(userId, { sortBy: { column: "created_at", order: "desc" } });

    if (response.error) {
        return Promise.reject(response.error);
    }

    const targetFiles = response.data.map((f) => `${userId}/${f.name}`);

    const { data: signedUrls, error } = await supabase.storage
        .from("files")
        .createSignedUrls(targetFiles, 60);

    if (error) return Promise.reject(error);

    return response.data.map((f, i) => ({
        ...f,
        url: signedUrls[i].signedUrl,
    }));
};

export const signout = async () => {
    return supabase.auth.signOut();
};

export function responseInterceptor<ResponseType>(
    response: PostgrestResponse<ResponseType>
) {
    if (!response) {
        console.error("[responseInterceptor] No Response");
        return Promise.reject(null);
    }
    if (response.error) {
        console.error(response.error);
        return Promise.reject(response.error);
    }
    return response.data;
}

export const createSignedUrl = async (filename: string): Promise<string> => {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    const { data, error } = await supabase.storage
        .from("files")
        .createSignedUrl(`${session?.user.id}/${filename}`, 60 * 60 * 1000);

    if (error) {
        return Promise.reject(error.message);
    }

    return data.signedUrl;
};
