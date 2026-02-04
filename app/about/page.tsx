import HeaderSection from "@/components/Header-Section";
import Image from "next/image";
import { IoEyeOutline, IoLocateOutline } from "react-icons/io5";

const AboutPage = () => {
    return (
        <div>
            <HeaderSection title="About Us" subTitle="Lorem ipsum dolor sit amet." />
            <div className="mx-w-screen-xl mx-auto py-20 px-4">
                <div className="grid md:grid-cols-2 gap-8">
                    <Image src="/bg1.png" width={650} height={579} alt="about image" />
                    <div>
                        <h1 className="text-5xl font-semibold text-white mb-4">Who We Are</h1>
                        <p className="text-gray-300 py-5">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolores amet voluptatum aliquam quasi suscipit non maiores numquam commodi quae labore.</p>
                        <ul className="list-item space-y-6 pt-8">
                            <li className="flex gap-5">
                                <div className="flex-none mt-1">
                                    <IoEyeOutline className="size-7" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold mb-1">Vision : </h4>
                                    <p className="text-gray-300">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid sunt voluptate eaque aspernatur magni unde.</p>
                                </div>
                            </li>
                            <li className="flex gap-5">
                                <div className="flex-none mt-1">
                                    <IoLocateOutline className="size-7" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold mb-1">Mision : </h4>
                                    <p className="text-gray-300">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus laboriosam error molestias exercitationem assumenda animi placeat hic perspiciatis alias neque.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;