import React, { useRef } from "react";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Tiles from "@cloudscape-design/components/tiles";
import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Textarea from "@cloudscape-design/components/textarea";
import Select from "@cloudscape-design/components/select";
import Alert from "@cloudscape-design/components/alert";
import { Box } from "@cloudscape-design/components";

import { get, post } from "aws-amplify/api"; //Dấu "" là double quotes

export default function ContentLayoutComponent() {
    const [value, setValue] = React.useState("gift-items");
    const [selectedOption, setSelectedOption] = React.useState({
        label: "",
        value: "",
    });
    const [name, setName] = React.useState("");
    const [phone, setphone] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [notes, setNotes] = React.useState("");
    const [STK, setSTK] = React.useState("");
    const [errors, setErrors] = React.useState({});
    const [alert, setAlert] = React.useState(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [selectedItemName, setSelectedItemName] = React.useState("Chuyển khoản");
    const [selectedImage, setSelectedImage] = React.useState("/images/5.png");

    // Create a ref for the form container
    const formRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = {};

        if (!name) {
            newErrors.name = "Bắt buộc Họ và tên";
        }
        const phoneRegex = /^\d{10}$/;
        if (!phone) {
            newErrors.phone = "Bắt buộc số điện thoại";
        } else if (!phoneRegex.test(phone)) {
            newErrors.phone = "Số điện thoại phải chứa đúng 10 chữ số";
        }
        if (!email) {
            newErrors.email = "Bắt buộc email";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            //Check email exist or not
            try {

                // Hàm GET lấy đối tượng từ DB, GET từ API truy vấn email 
                const existingEmail = get({
                    apiName: "apie8f22478",
                    path: "/items",
                    options: {
                        queryParams: {
                            email: email,
                        },
                    },
                });
                const { body } = await existingEmail.response; // body trích xuất từ existingEmail.response
                const json = await body.json(); // dạng JSON, Object khai báo thông tin
                console.log(json);
                // If email existed
                // Object trả về mảng DB tất cả email, nếu lenght > 0 mà kiểm tra so sanh email
                if (Object.keys(json).length > 0) {
                    setAlert({
                        type: "error",
                        header: "Đăng ký không thành công",
                        content: "Email này đã được đăng ký.",
                    });
                } else {  // if not
                    // Perform the POST request
                    // Khai báo thông tin
                    const dataPost = post({
                        apiName: "apie8f22478",
                        path: "/items",
                        options: {
                            method: "POST",
                            body: {
                                name: name,
                                phone: phone,
                                email: email,
                                STK: STK,
                                notes: notes,
                                bank: selectedOption.label,
                                selectedItemName: selectedItemName,
                                selectedImage: selectedImage,
                            },
                        },
                    });

                    const responsePost = await dataPost.response; //Lấy trích xuất dataPost.response 
                    console.log("POST call succeeded"); //Kiếm tra Post lên DB 
                    console.log(responsePost); //Kiểm tra đối tượng

                    // Làm mới form sau khi đăng ký thành công
                    setName("");
                    setphone("");
                    setEmail("");
                    setSTK("");
                    setNotes("");
                    setAlert({
                        type: "success",
                        header: "Đăng ký thành công",
                        content: `Bạn đã đăng ký thành công với quà tặng: ${selectedItemName}`,
                    });
                }
            } catch (e) {
                console.log("GET call failed: ", e);
            } finally {
                setIsSubmitting(false);
            }

            setErrors({});
        }
    };

    const handleTileChange = ({ detail }) => {
        setValue(detail.value);

        // Update selected image and item name based on selected tile
        if (detail.value === "gift-items") {
            setSelectedItemName("Chuyển khoản tiền");
            setSelectedImage("/images/5.png");
        } else if (detail.value === "item2") {
            setSelectedItemName("Nhận tiền mặt");
            setSelectedImage("/images/6.png");
        }

        // Scroll to the form when a tile is selected
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
            <ContentLayout
                defaultPadding
                headerBackgroundStyle="linear-gradient(135deg, rgb(71, 17, 118) 3%, rgb(131, 57, 157) 44%, rgb(149, 85, 182) 69%, rgb(145, 134, 215) 94%)"
                headerVariant="high-contrast"
                maxContentWidth={800}
                header={
                    <Header
                        variant="h1"
                        description="Chủ nhật, ngày 22/09/2024 || 8/4 Bà Huyện Thanh Quan, Phường 6, Quận 3, TP.HCM"
                    >
                        TỔ CHỨC CHỐNG LỪA ĐẢO KHÔNG GIAN MẠNG
                    </Header>
                }
            ></ContentLayout>
            <Box className="header-content" variant="h1" padding={{ top: "m" }}>
                Cộng đồng người Điếc/Khiếm thính ở thành phố Hồ Chí Minh
            </Box>
            <div className="content-container">
                <div className="tiles-container">
                    <Tiles
                        onChange={handleTileChange} // Use handleTileChange to trigger scroll
                        className="tile"
                        value={value}
                        ariaRequired
                        items={[
                            {
                                label: "Chuyển khoản tiền",
                                image: (
                                    <img
                                        src="/images/5.png"
                                        alt="Chuyển khoản tiền"
                                        className="tiles-item"
                                    />
                                ),
                                value: "gift-items",
                            },
                            {
                                label: "Nhận tiền mặt",
                                image: (
                                    <img
                                        src="/images/6.png"
                                        alt="Nhận tiền mặt"
                                        className="tiles-item"
                                    />
                                ),
                                value: "item2",
                            },
                        ]}
                    />
                </div>

                <div className="form-container" ref={formRef}>
                    {/* Alert for success or error */}
                    {alert && (
                        <Alert
                            className="alert"
                            type={alert.type}
                            header={alert.header}
                            dismissible
                            onDismiss={() => setAlert(null)}
                        >
                            {alert.content}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Form
                            actions={
                                <SpaceBetween direction="horizontal" size="xs">
                                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Đang xử lý..." : "Submit"}
                                    </Button>
                                </SpaceBetween>
                            }
                        >
                            <Container
                                header={<Header variant="h2">Form Đăng ký tham gia chống lừa đảo không gian mạng</Header>}
                            >
                                <SpaceBetween direction="vertical" size="l">
                                    <FormField label="Họ và tên" description="Please enter your full name" errorText={errors.name}>
                                        <Input
                                            value={name}
                                            onChange={({ detail }) => setName(detail.value)}
                                            required
                                            ariaRequired
                                        />
                                    </FormField>
                                    <FormField label="Số điện thoại" description="Please enter your phone number" errorText={errors.phone}>
                                        <Input
                                            value={phone}
                                            onChange={({ detail }) => setphone(detail.value)}
                                            required
                                            ariaRequired
                                        />
                                    </FormField>
                                    <FormField label="Email" description="Please enter your email address" errorText={errors.email}>
                                        <Input
                                            value={email}
                                            type="email"
                                            onChange={({ detail }) => setEmail(detail.value)}
                                            required
                                            ariaRequired
                                        />
                                    </FormField>
                                    <FormField label="Số tài khoản" description="Please enter your account number">
                                        <Input
                                            value={STK}
                                            onChange={({ detail }) => setSTK(detail.value)}
                                            disabled={value !== "gift-items"}
                                        />
                                    </FormField>
                                    <FormField label="Tên ngân hàng" description="Please select your preferred T-shirt size">
                                        <Select
                                            selectedOption={selectedOption}
                                            onChange={({ detail }) =>
                                                setSelectedOption(detail.selectedOption)
                                            }
                                            options={[
                                                { label: "Agribank", value: "1" },
                                                { label: "VPBank", value: "2" },
                                                { label: "Techcombank", value: "3" },
                                                { label: "BIDV", value: "4" },
                                                { label: "Vietcombank", value: "5" },
                                                { label: "VietinBank", value: "7" },
                                                { label: "ACB", value: "8" },
                                                { label: "SHB", value: "9" },
                                                { label: "VIB", value: "10" },
                                                { label: "SeABank", value: "11" },
                                                { label: "TPBank", value: "12" },
                                                { label: "LPBank", value: "13" },
                                                { label: "OCB", value: "14" },
                                                { label: "SCB", value: "15" },
                                                { label: "MSB", value: "16" },
                                                { label: "Sacombank", value: "17" },
                                                { label: "Eximbank", value: "18" },
                                                { label: "Bac A Bank", value: "19" },
                                                { label: "VietBank", value: "20" },

                                            ]}
                                            disabled={value !== "gift-items"}
                                        />
                                    </FormField>

                                    <FormField label="Note" description="Please fill in your note or notes if you request!">
                                        <Textarea
                                            value={notes}
                                            onChange={({ detail }) => setNotes(detail.value)}
                                            placeholder="Nếu không có tên ngân hàng thì hãy ghi chú đây. Ví dụ: 032332434234, Phạm Van A, VCB"
                                        />
                                    </FormField>

                                    {/* Display selected image and item name */}
                                    <FormField label="Cám ơn bạn đã tham gia!" description="Thanks for join event! ">
                                        <Box variant="h3">{selectedItemName}</Box>
                                        <img
                                            src={selectedImage}
                                            alt={selectedItemName}
                                            style={{ maxWidth: "100px" }}
                                        />
                                    </FormField>
                                </SpaceBetween>
                            </Container>
                        </Form>
                    </form>
                </div>
            </div>
        </>
    );
}
