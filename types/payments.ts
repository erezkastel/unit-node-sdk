import { Relationship, Counterparty } from "./common";

type PaymentStatus = 'Pending' | 'Rejected' | 'Clearing' | 'Sent' | 'Canceled' | 'Returned'

export type Payment = ACHPayment | BookPayment

interface BasePaymentAttributes {
    /**
     * Date only. The date the resource was created.
     * RFC3339 format. For more information: https://en.wikipedia.org/wiki/ISO_8601#RFCs
     */
    createdAt: string

    /**
     * One of Pending, Rejected, Clearing, Sent, Canceled, Returned. See [ACH Status](https://developers.unit.co/#ach-status).
     */
    status: PaymentStatus

    /**
     * (Optional) More information about the status.
     */
    reason?: string

    /**
     * The direction in which the funds flow (either Debit or Credit).
     */
    direction: string

    /**
     * Payment description (maximum of 10 characters), also known as Company Entry Description, this will show up on statement of the counterparty.
     */
    description: string

    /**
     * The amount (cents) of the payment.
     */
    amount: string

    /**
     * See [Tags](https://developers.unit.co/#tags).
     */
    tags: object
}

export interface ACHPayment {
    /**
     * Identifier of the ACH payment resource.
     */
    id: string

    /**
     * Type of the payment resource. For originations the value is achPayment.
     */
    type: 'achPayment'

    /**
     * JSON object representing the payment resource.
     */
    attributes: {

        /**
         * The party on the other side of the ACH payment.
         */
        counterparty: Counterparty

        /**
         * Optional, additional payment description (maximum of 50 characters), not all institutions present that.
         */
        addenda?: string

        /**
         * RFC3339 format. For more information: https://en.wikipedia.org/wiki/ISO_8601#RFCs
         * Optional, For Clearing, shows the date on which the payment will be settled.
         */
        settlementDate?: string
    } & BasePaymentAttributes

    /**
     * Describes relationships between the ACH payment and the originating deposit account and customer.
     */
    relationships: {
        /**
         * The Deposit Account originating the transfer.
         */
        account: Relationship

        /**
         * The Customer the deposit account belongs to. The customer is either a business or a individual.
         */
        customer: Relationship

        /**
         * The Counterparty the payment to be made to.
         */
        counterparty: Relationship
    }
}

interface BookPayment {
    /**
     * 	Identifier of the book payment resource.
     */
    id: string

    /**
     * Type of the payment resource. The value is always bookPayment.
     */
    type: "bookPayment"

    /**
     * JSON object representing the payment resource.
     */
    attributes: BasePaymentAttributes

    /**
     * Describes relationships between the Book payment and the originating deposit account and customer.
     */
    relationships: {
        /**
         * The Deposit Account originating the transfer.
         */
        account: Relationship

        /**
         * The Customer the deposit account belongs to. The customer is either a business or a individual.
         */
        customer: Relationship

        /**
         * The Counterparty account the payment to be made to.
         */
        counterpartyAccount: Relationship
 
        /**
         * The Customer the counterparty account belongs to.The customer is either a business or a individual.
         */
         counterpartyCustomer: Relationship
 
        /**
         * The Book Transaction generated by this payment.
         */
         transaction: Relationship
    }
}

export interface PatchPaymentRequest {
    type: "achPayment" | "bookPayment"
    attributes: {
        tags: object
    }
}

export type CreatePaymentRequest = CreateBookPaymentRequest | CreateInlinePaymentRequest | CreateLinkedPaymentRequest | CreateVerifiedPaymentRequest

export interface CreateBookPaymentRequest {
    type: 'bookPayment'

    attributes: {
        /**
         * The amount (in cents).
         */
        amount: number

        /**
         * Payment description (maximum of 50 characters), this will show up on statement of the counterparty.
         */
        description: string

        /**
         * See Idempotency.
         */
        idempotencyKey?: string

        /**
         * See [Tags](https://developers.unit.co/#tags). Tags that will be copied to any transaction that this payment creates (see [Tag Inheritance](https://developers.unit.co/#tag-inheritance)).
         */
        tags?: object
    }

    relationships: {
        /**
         * The Deposit Account originating the payment.
         */
        account: Relationship

        /**
         * The Counterparty account the payment to be made to
         */
        counterpartyAccount: Relationship
    }
}

export interface CreateInlinePaymentRequest {
    type: "achPayment"

    attributes: {
        /**
         * The amount (in cents).
         */
        amount: number

        /**
         * The direction in which the funds flow.
         */
        direction: string

        /**
         * The party on the other side of the ACH payment.
         */
        counterparty: Counterparty

        /**
         * Payment description (maximum of 10 characters), also known as Company Entry Description, this will show up on statement of the counterparty.
         */
        description: string

        /**
         * Optional, additional payment description (maximum of 50 characters), not all institutions present that.
         */
        addenda?: string

        /**
         * See Idempotency.
         */
        idempotencyKey: string

        /**
         * See [Tags](https://developers.unit.co/#tags). Tags that will be copied to any transaction that this payment creates (see [Tag Inheritance](https://developers.unit.co/#tag-inheritance)).
         */
        tags: object
    }

    relationships: {
        /**
         * The Deposit Account originating the payment.
         */
        account: Relationship
    }

}

export interface CreateLinkedPaymentRequest {
    type: "achPayment"

    attributes: {
        /**
        * The amount (in cents).
        */
        amount: number

        /**
         * The direction in which the funds flow.
         */
        direction: string

        /**
        * Payment description (maximum of 10 characters), also known as Company Entry Description, this will show up on statement of the counterparty.
        */
        description: string

        /**
         * Optional, additional payment description (maximum of 50 characters), not all institutions present that.
         */
        addenda?: string

        /**
         * See Idempotency.
         */
        idempotencyKey: string

        /**
         * See [Tags](https://developers.unit.co/#tags). Tags that will be copied to any transaction that this payment creates (see [Tag Inheritance](https://developers.unit.co/#tag-inheritance)).
         */
        tags: object
    }

    relationships: {
        /**
         * The Deposit Account originating the payment.
         */
        account: Relationship

        /**
         * The Counterparty the payment to be made to.
         */
        counterparty: Relationship
    }
}

export interface CreateVerifiedPaymentRequest {
    type: "achPayment"

    attributes: {
        /**
         * The amount (in cents).
         */
        amount: number

        /**
         * The direction in which the funds flow.
         */
        direction: string

        /**
        * Payment description (maximum of 10 characters), also known as Company Entry Description, this will show up on statement of the counterparty.
        */
        description: string

        /**
         * See Idempotency.
         */
        idempotencyKey: string

        /**
         * Name of the person or company that owns the counterparty bank account.
         */
        counterpartyName: string

        /**
         * See Create Plaid processor token API
         */
        plaidProcessorToken: string
    }

    relationships: {
        /**
         * The Deposit Account originating the payment.
         */
        account: Relationship
    }
}