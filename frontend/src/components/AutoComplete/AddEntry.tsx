import { AutoCompleteCreatable, useAutoCompleteContext } from "@choc-ui/chakra-autocomplete";
import axiosInstance from "services/axios";
import { TagCreationInformation } from "types/tagType";

type AddEntryProps = {
    fetchTags: () => void;
}

export const AddEntry = (props: AddEntryProps) => {
    const context = useAutoCompleteContext();
    const addEntry = () => {
        try {
            const creationInformation: TagCreationInformation = { name: context.query };
            axiosInstance.post('tag/create-tag', creationInformation).then((res) => {
                if (res.data !== undefined) {
                    props.fetchTags();;
                }
            });
        }
        catch (err) {

        }
    };


    return (
        <AutoCompleteCreatable onClick={() => addEntry()}>
            Add {context.query}
        </AutoCompleteCreatable>
    );
};