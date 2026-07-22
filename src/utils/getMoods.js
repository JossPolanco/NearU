import enamoradoJo from "../assets/img/stikers/Josue/enamorado_jo.webp";
import enamoradaEv from "../assets/img/stikers/Evelyn/enamorada_ev.webp";

export const MOODS_MALE = [
    {
        title: "Normal",
        description: "Todo tranqui, todo bonito.",
        className: "bg-base-200/50 border border-base-300/80 text-base-content",
        photo: "",
        emoji: "😐",
    },
    {
        title: "Feliz",
        description: "Ando feliiiiiz",
        className: "bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 dark:border-amber-400/30 text-base-content",
        photo: "",
        emoji: "😊",
    },
    {
        title: "Enamorado",
        description: "Que bonito es estar juntos",
        className: "bg-rose-500/10 dark:bg-rose-400/10 border border-rose-500/20 dark:border-rose-400/30 text-base-content",
        photo: enamoradoJo,
        emoji: "🥰",
    },
    {
        title: "Aburrido",
        description: "Que aburrimiento...",
        className: "bg-slate-500/10 dark:bg-slate-400/10 border border-slate-500/20 dark:border-slate-400/30 text-base-content",
        photo: "",
        emoji: "🥱",
    },
    {
        title: "Triste",
        description: "Ando un poco triste",
        className: "bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 dark:border-blue-400/30 text-base-content",
        photo: "",
        emoji: "😢",
    },
    {
        title: "Enojado",
        description: "Mejor ni me hables, ya que ando enojado",
        className: "bg-red-500/10 dark:bg-red-400/10 border border-red-500/20 dark:border-red-400/30 text-base-content",
        photo: "",
        emoji: "😡",
    },
    {
        title: "Hot",
        description: "Quiero cogerte duro 🔥",
        className: "bg-orange-500/10 dark:bg-orange-400/10 border border-orange-500/20 dark:border-orange-400/30 text-base-content",
        photo: "",
        emoji: "🔥",
    },
    {
        title: "Cariñoso",
        description: "Solo quiero abrazos y mimos",
        className: "bg-pink-500/10 dark:bg-pink-400/10 border border-pink-500/20 dark:border-pink-400/30 text-base-content",
        photo: "",
        emoji: "🤗",
    },
    {
        title: "Hambriento",
        description: "Se me antoja algo rico",
        className: "bg-green-500/10 dark:bg-green-400/10 border border-green-500/20 dark:border-green-400/30 text-base-content",
        photo: "",
        emoji: "😋",
    },
    {
        title: "Send nudes",
        description: "Manda nudes plss 🥵",
        className: "bg-fuchsia-500/10 dark:bg-fuchsia-400/10 border border-fuchsia-500/20 dark:border-fuchsia-400/30 text-base-content",
        photo: "",
        emoji: "🥵",
    },
];

export const MOODS_FEMALE = [
    {
        title: "Normal",
        description: "Todo tranqui, todo bonito.",
        className: "bg-base-200/50 border border-base-300/80 text-base-content",
        photo: "",
        emoji: "😐",
    },
    {
        title: "Feliz",
        description: "Ando feliiiiiz",
        className: "bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 dark:border-amber-400/30 text-base-content",
        photo: "",
        emoji: "😊",
    },
    {
        title: "Enamorado",
        description: "Que bonito es estar juntos",
        className: "bg-rose-500/10 dark:bg-rose-400/10 border border-rose-500/20 dark:border-rose-400/30 text-base-content",
        photo: enamoradaEv,
        emoji: "🥰",
    },
    {
        title: "Aburrido",
        description: "Que aburrimiento...",
        className: "bg-slate-500/10 dark:bg-slate-400/10 border border-slate-500/20 dark:border-slate-400/30 text-base-content",
        photo: "",
        emoji: "🥱",
    },
    {
        title: "Triste",
        description: "Ando un poco triste",
        className: "bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 dark:border-blue-400/30 text-base-content",
        photo: "",
        emoji: "😢",
    },
    {
        title: "Enojado",
        description: "Mejor ni me hables, ya que ando enojada",
        className: "bg-red-500/10 dark:bg-red-400/10 border border-red-500/20 dark:border-red-400/30 text-base-content",
        photo: "",
        emoji: "😡",
    },
    {
        title: "Hot",
        description: "Quiero que me folles duro 🔥",
        className: "bg-orange-500/10 dark:bg-orange-400/10 border border-orange-500/20 dark:border-orange-400/30 text-base-content",
        photo: "",
        emoji: "🔥",
    },
    {
        title: "Cariñoso",
        description: "Solo quiero abrazos y mimos",
        className: "bg-pink-500/10 dark:bg-pink-400/10 border border-pink-500/20 dark:border-pink-400/30 text-base-content",
        photo: "",
        emoji: "🤗",
    },
    {
        title: "Hambriento",
        description: "Se me antoja algo rico",
        className: "bg-green-500/10 dark:bg-green-400/10 border border-green-500/20 dark:border-green-400/30 text-base-content",
        photo: "",
        emoji: "😋",
    },
    {
        title: "Send dick pics",
        description: "Manda dick pics plss 😈",
        className: "bg-fuchsia-500/10 dark:bg-fuchsia-400/10 border border-fuchsia-500/20 dark:border-fuchsia-400/30 text-base-content",
        photo: "",
        emoji: "😈",
    },
];

export function getMoodsByGender(gender) {
    return gender === "female" ? MOODS_FEMALE : MOODS_MALE;
}

export function getMoodData(gender, moodTitle) {
    const list = getMoodsByGender(gender);
    if (!moodTitle) return list[0];
    return list.find((m) => m.title.toLowerCase() === moodTitle.toLowerCase()) || list[0];
}