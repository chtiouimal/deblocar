"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { setRetailUser } from "@/retailStore/retailAuthSlice";

export function useAuthInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (data.user) {
          dispatch(setUser(data.user));
        } else {
          dispatch(setUser(null));
        }
      } catch {
        dispatch(setUser(null));
      }
    };

    init();
  }, []);
}

export function useAuthRetailInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch("/api/retail/auth/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (data.user) {
          dispatch(setRetailUser(data.user));
        } else {
          dispatch(setRetailUser(null));
        }
      } catch {
        dispatch(setRetailUser(null));
      }
    };

    init();
  }, []);
}
