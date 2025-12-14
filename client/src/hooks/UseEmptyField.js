import { useEffect, useState } from "react";

export default function useEmptyValidator(fields = []) {
    const [isAnyEmpty, setIsAnyEmpty] = useState(true);

    useEffect(() => {
        const empty = fields.some((value) => value.trim() === "");
        setIsAnyEmpty(empty);
    }, [fields]);

    return { isAnyEmpty };
}
