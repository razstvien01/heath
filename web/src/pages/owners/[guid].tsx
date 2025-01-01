import { Input } from "@/components/ui/input"

export default function OwnerManagementPage({ guid } : { guid : String }) {
    console.log("OwnerManagementPage", guid);
    return (
        <div>
            <h1>Owner Management Page {guid}</h1>
      <Input placeholder="Username" />
      <Input placeholder="Password" type="password" />
        </div>
    )
};

import { GetServerSideProps, GetServerSidePropsContext } from 'next';

export const getServerSideProps: GetServerSideProps = async (
    ctx: GetServerSidePropsContext
  ) => {
    const guid = ctx.params?.guid as string;
    const fetchUrl = process.env.BASE_URL + "/api/isAdminGuid";

    const formData = new FormData();
    formData.append("guid", guid);

    const res = await fetch(fetchUrl, {
      method: "POST",
      body: formData,
    });

    if(res.ok) {
      return {
        props: {
          guid
        },
      };
    }
    else {
      return {
        notFound: true
      };
    }
};
  