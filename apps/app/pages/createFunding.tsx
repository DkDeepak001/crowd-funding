import { NextPage } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFundingContract } from "../hooks/useFundingContract";
import {
  useAddress,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";

const CreateFunding: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const address = useAddress();
  const { contract: fundingContract } = useFundingContract();
  const {
    mutateAsync: create,
    isLoading: isCreating,
    isSuccess,
  } = useContractWrite(fundingContract, "createCampaing");

  const onSubmit = handleSubmit(async (data) => {
    if (!address) alert("connect metamask");
    try {
      await create({
        args: [data.title, data.description, data.goal, data.image],
      });
      if (isSuccess) {
        alert("create success");
        setValue("title", "");
        setValue("description", "");
        setValue("image", "");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl font-extrabold mb-5 ">Create a Campaing</h1>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-y-3 bg-white  rounded-xl p-6 w-2/4"
      >
        <label className="text-normal mt-4 font-normal">Title</label>
        <input
          type="text"
          placeholder="title"
          {...register("title")}
          className="mt-2.5 w-full rounded-lg bg-gray-100 px-4 py-4"
        />
        {errors.title && (
          <span className="text-red-500">{errors.title.message} </span>
        )}

        <label className="text-normal mt-4 font-normal">Description</label>
        <input
          type="text"
          className="mt-2.5 w-full rounded-lg bg-gray-100 px-4 py-4"
          {...register("description")}
          placeholder="Descripition"
        />
        {errors.description && (
          <span className="text-red-500">{errors.description.message} </span>
        )}
        <label className="text-normal mt-4 font-normal">Goal (in token)</label>
        <input
          type="number"
          {...register("goal", {
            setValueAs: (value) => Number(value),
          })}
          className="mt-2.5 w-full rounded-lg bg-gray-100 px-4 py-4"
          placeholder="Goal"
        />
        {errors.goal && (
          <span className="text-red-500">{errors.goal.message} </span>
        )}
        {/* <label className="text-normal mt-4 font-normal">Deadline</label>
        <input
          type="date"
          {...register("deadline", {
            setValueAs: (value) => new Date(value),
          })}
          className="mt-2.5 w-full rounded-lg bg-gray-100 px-4 py-4"
          placeholder="Deadline"
        />
        {errors.deadline && (
          <span className="text-red-500">{errors.deadline.message} </span>
        )} */}
        <label className="text-normal mt-4 font-normal">Image</label>
        <input
          type="text"
          {...register("image")}
          className="mt-2.5 w-full rounded-lg bg-gray-100 px-4 py-4"
          placeholder="Image"
        />
        {errors.image && (
          <span className="text-red-500">{errors.image.message} </span>
        )}

        <button
          type="submit"
          className="bg-black text-white font-extrabold py-4 w-2/4 rounded-3xl self-center mt-3"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateFunding;

const schema = z.object({
  title: z
    .string()
    .min(1, { message: "Title should be at least 1 character long" })
    .max(50, { message: "Title should be at most 50 characters long" }),
  description: z
    .string()
    .min(1, { message: "Descripition should be at least 1 character long" })
    .max(500, {
      message: "Descripition should be at most 500 characters long",
    }),
  goal: z.number().min(1, { message: "Goal should be at least 1 token" }),
  // deadline: z
  //   .date()
  //   .min(new Date(), { message: "Deadline should be in the future" }),
  image: z.string().url({ message: "Image should be a valid url" }),
});

type FormValues = z.infer<typeof schema>;
